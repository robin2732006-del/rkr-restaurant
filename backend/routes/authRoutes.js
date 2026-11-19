const express = require("express");

const router = express.Router();

const {
    signup,
    login,
    getProfile,
    updateProfile,
    changePassword,
    resetPassword
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
   FORGOT / RESET PASSWORD
========================================================= */

router.post("/reset-password", resetPassword);
router.post("/forgot-password", resetPassword);

/* =========================================================
   PROFILE
========================================================= */

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;