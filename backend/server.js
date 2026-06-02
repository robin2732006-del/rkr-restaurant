const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

/* =========================================================
   ROUTES
========================================================= */
const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");

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
app.use(morgan("dev"));
app.use(helmet());

app.use("/uploads", express.static("uploads"));

/* =========================================================
   DATABASE CONNECTION
========================================================= */
const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB...");
        console.log("URI:", process.env.MONGO_URI);

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed");
        console.error(error.message);

        process.exit(1);
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

/* =========================================================
   ROOT ROUTE
========================================================= */
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "RKR Restaurant API Running"
    });
});

/* =========================================================
   404 HANDLER
========================================================= */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    });
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
    console.log(`🚀 Server Running on Port ${PORT}`);
});