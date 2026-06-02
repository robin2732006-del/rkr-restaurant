const express = require("express");

const router = express.Router();

const {
    createPayment
} = require("../controllers/paymentController");

/* =========================================================
   CREATE PAYMENT
========================================================= */

router.post(
    "/create",
    createPayment
);

module.exports = router;