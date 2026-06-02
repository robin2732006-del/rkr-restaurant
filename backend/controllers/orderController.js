const Order = require("../models/Order");

/* ==========================================
   CREATE ORDER
========================================== */
exports.createOrder = async (req, res) => {
    try {

        console.log("========== ORDER REQUEST ==========");
        console.log("BODY:", req.body);
        console.log("USER:", req.user);

        const order = await Order.create({
            ...req.body,
            user: req.user.id || req.user._id
        });

        console.log("ORDER SAVED:", order);

        res.status(201).json({
            success: true,
            order
        });

    } catch (error) {

        console.error("ORDER ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* ==========================================
   GET ORDERS
========================================== */
exports.getOrders = async (req, res) => {
    try {

        const orders = await Order.find()
            .populate("user");

        res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {

        console.error("GET ORDERS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};