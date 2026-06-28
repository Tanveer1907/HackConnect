const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./src/models/Message");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const jwt = require("jsonwebtoken");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"]
  }
});

// Authentication handshake middleware
io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded.user || decoded;
    if (!socket.user.id && (decoded.id || decoded._id)) {
      socket.user.id = decoded.id || decoded._id;
    }
    next();
  } catch (err) {
    console.error("Socket authentication error:", err.message);
    next(new Error("Authentication error: Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id} (User ID: ${socket.user?.id})`);

  // Let each user join a personal room (their userId) for direct delivery
  socket.on("authenticate", (data) => {
    const authUserId = socket.user?.id;
    if (authUserId) {
      socket.join(authUserId);
      console.log(`User ${socket.id} joined personal room: ${authUserId}`);
    }
  });

  socket.on("join_room", (data) => {
    const authUserId = socket.user?.id;
    if (!authUserId || !data.roomId) return;

    // Verify room is user's personal room or the user is part of the chat room
    const roomUsers = data.roomId.split('-');
    if (data.roomId !== authUserId && !roomUsers.includes(authUserId)) {
      console.warn(`User ${authUserId} tried to join unauthorized room: ${data.roomId}`);
      return;
    }

    socket.join(data.roomId);
    console.log(`User with ID: ${socket.id} joined room: ${data.roomId}`);
  });

  socket.on("send_message", async (data) => {
    const authUserId = socket.user?.id;
    if (!authUserId || !data.roomId) return;

    // Verify sender ID matches authenticated user ID
    const senderId = data.senderId || data.sender;
    if (senderId !== authUserId) {
      console.warn(`User ${authUserId} tried to send message as ${senderId}`);
      return;
    }

    // Verify user belongs to the room
    const roomUsers = data.roomId.split('-');
    if (!roomUsers.includes(authUserId)) {
      console.warn(`User ${authUserId} tried to send message to unauthorized room: ${data.roomId}`);
      return;
    }

    try {
      const newMessage = new Message({
        roomId: data.roomId,
        sender: authUserId,
        text: data.text
      });
      await newMessage.save();

      const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'name email profileImage');

      // Emit to the chat room (for users who have joined it)
      io.to(data.roomId).emit("receive_message", populatedMessage);

      // Also emit to both users' personal rooms (ensures delivery even if they haven't joined the chat room)
      const userIds = data.roomId.split('-');
      userIds.forEach(uid => {
        io.to(uid).emit("receive_message", populatedMessage);
      });
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});