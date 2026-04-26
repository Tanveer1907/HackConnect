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

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for dev
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data.roomId);
    console.log(`User with ID: ${socket.id} joined room: ${data.roomId}`);
  });

  socket.on("send_message", async (data) => {
    try {
      const newMessage = new Message({
        roomId: data.roomId,
        sender: data.senderId || data.sender,
        text: data.text
      });
      await newMessage.save();

      const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'username name profileImage');

      io.to(data.roomId).emit("receive_message", populatedMessage);
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