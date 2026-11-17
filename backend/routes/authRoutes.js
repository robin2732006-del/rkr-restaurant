const express = require("express");

const router = express.Router();

const {
    signup,
    login,
    getProfile,
    updateProfile,
    changePassword
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

/* =========================================================
   SIGNUP
========================================================= */

router.post("/signup", signup);

/* =========================================================
   LOGIN
========================================================= */

router.post("/login", login);

/* =========================================================
   PROFILE
========================================================= */

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;