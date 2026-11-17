const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const path = require("path");
const http = require("http");
const dns = require("dns");
const { Server } = require("socket.io");

dotenv.config();

// Configure reliable DNS servers to resolve MongoDB Atlas SRV records on Windows networks
try {
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (dnsErr) {
    // Keep standard resolver if restricted
}

/* =========================================================
   ROUTES
========================================================= */
const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes");

/* =========================================================
   APP INIT
========================================================= */
const app = express();
const server = http.createServer(app);

/* =========================================================
   SOCKET.IO
========================================================= */
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

/* =========================================================
   MIDDLEWARE
========================================================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));

// Serve static frontend files and uploads
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================================================
   DATABASE CONNECTION
========================================================= */
let isConnecting = false;

const connectDB = async (retryCount = 0) => {
    if (isConnecting) return;
    isConnecting = true;

    const primaryURI = process.env.MONGO_URI;
    const localURI = process.env.MONGO_URI_LOCAL || "mongodb://127.0.0.1:27017/rkr_restaurant";

    const safeURI = primaryURI ? primaryURI.replace(/:([^@]+)@/, ":****@") : "Not Set";
    console.log("🔄 Connecting to MongoDB...");
    console.log("   Primary URI:", safeURI);

    const connectOptions = {
        serverSelectionTimeoutMS: 8000,
        family: 4 // Use IPv4 for instant DNS resolution on Windows
    };

    try {
        await mongoose.connect(primaryURI, connectOptions);
        console.log("✅ MongoDB Connected Successfully to Cloud Atlas!");
        isConnecting = false;
        return;
    } catch (cloudErr) {
        console.warn("⚠️ Cloud MongoDB connection warning:", cloudErr.message);

        // Try local MongoDB as immediate resilient fallback
        try {
            console.log("🔄 Trying fallback connection to Local MongoDB (127.0.0.1:27017)...");
            await mongoose.connect(localURI, { ...connectOptions, serverSelectionTimeoutMS: 2000 });
            console.log("✅ Fallback: Connected to Local MongoDB successfully!");
            isConnecting = false;
            return;
        } catch (localErr) {
            console.error("❌ MongoDB Connection issue:");
            console.error("   Cloud error:", cloudErr.message);
            console.error("   Local error:", localErr.message);
        }

        isConnecting = false;

        // Keep server running so frontend & static files are always accessible!
        const nextRetry = Math.min(10000, 3000 + retryCount * 2000);
        console.log(`⏳ Server remains running. Retrying MongoDB connection in ${nextRetry / 1000}s...`);
        setTimeout(() => connectDB(retryCount + 1), nextRetry);
    }
};

connectDB();

/* =========================================================
   SOCKET EVENTS
========================================================= */
io.on("connection", (socket) => {

    console.log(`🔌 User Connected: ${socket.id}`);

    socket.on("newOrder", (data) => {
        io.emit("orderReceived", data);
    });

    socket.on("disconnect", () => {
        console.log(`❌ User Disconnected: ${socket.id}`);
    });

});

/* =========================================================
   API ROUTES
========================================================= */
app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contacts", contactRoutes);

/* =========================================================
   API STATUS ROUTE
========================================================= */
app.get("/api", (req, res) => {
    res.status(200).json({
        success: true,
        message: "RKR Restaurant API Running"
    });
});

/* =========================================================
   404 & FRONTEND FALLBACK HANDLER
========================================================= */
app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
        return res.status(404).json({
            success: false,
            message: "API Route Not Found"
        });
    }
    // Fallback to index.html for SPA/page routes (not for missing files like .css, .js, .png)
    if (req.accepts("html") && !req.path.includes(".")) {
        return res.sendFile(path.join(__dirname, "../frontend/index.html"));
    }
    res.status(404).send("File Not Found");
});

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
});

/* =========================================================
   SERVER START
========================================================= */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 Server is running!`);
    console.log(`👉 View Website:  http://localhost:${PORT}`);
    console.log(`👉 Local:         http://127.0.0.1:${PORT}`);
    console.log(`👉 API Status:    http://localhost:${PORT}/api`);
    console.log(`==================================================\n`);
});