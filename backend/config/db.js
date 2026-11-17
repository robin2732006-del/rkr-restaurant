const mongoose = require("mongoose");
const dns = require("dns");

try {
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {}

const connectDB = async () => {
    const primaryURI = process.env.MONGO_URI;
    const localURI = process.env.MONGO_URI_LOCAL || "mongodb://127.0.0.1:27017/rkr_restaurant";

    const options = {
        serverSelectionTimeoutMS: 8000,
        family: 4
    };

    try {
        const conn = await mongoose.connect(primaryURI, options);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.warn(`⚠️ Cloud MongoDB Error: ${error.message}`);
        try {
            const localConn = await mongoose.connect(localURI, { ...options, serverSelectionTimeoutMS: 2000 });
            console.log(`✅ Connected to Local MongoDB: ${localConn.connection.host}`);
        } catch (localErr) {
            console.error("❌ Both Cloud and Local MongoDB failed to connect.");
        }
    }
};

module.exports = connectDB;