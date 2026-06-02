const express = require("express");

const {
    dashboard
} = require("../controllers/adminController");

const authMiddleware = require(
    "../middleware/authMiddleware"
);

const adminMiddleware = require(
    "../middleware/adminMiddleware"
);

const router = express.Router();

router.get(
    "/dashboard",
    authMiddleware,
    adminMiddleware,
    dashboard
);

module.exports = router;