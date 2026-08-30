const mongoose = require('mongoose');
const dns = require('dns');

// Configure DNS servers for reliable SRV resolution on MacOS / local ISPs
try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1', '1.0.0.1']);
} catch (e) {
    console.warn("Could not set custom DNS servers:", e.message);
}

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 15000,
            connectTimeoutMS: 15000,
            socketTimeoutMS: 45000,
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        throw error;
    }
};

module.exports = connectDB;
