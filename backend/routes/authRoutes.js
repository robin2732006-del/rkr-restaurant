const express = require("express");

const router = express.Router();

const {
    signup,
    login
} = require("../controllers/authController");

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

router.get("/profile", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Profile Route Working"
    });

});

module.exports = router;