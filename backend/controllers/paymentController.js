const Razorpay = require("razorpay");

/* =========================================================
   SAFE RAZORPAY INSTANCE
========================================================= */

if (
    !process.env.RAZORPAY_KEY_ID ||
    !process.env.RAZORPAY_SECRET
) {

    console.log(
        "Razorpay Keys Missing in .env"
    );

}

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "dummy_key",
    key_secret: process.env.RAZORPAY_SECRET || "dummy_secret"
});

/* =========================================================
   CREATE PAYMENT ORDER
========================================================= */

const createPayment = async (req, res) => {

    try {

        const { amount } = req.body;

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    createPayment
};