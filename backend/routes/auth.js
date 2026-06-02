const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================================================
   HELPERS
========================================================= */

const generateToken = (id, role) => {
    return jwt.sign(
        {
            id,
            role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
};

const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password) => {
    return password.length >= 6;
};

/* =========================================================
   SIGNUP
========================================================= */

router.post("/signup", async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;

        /* ===============================
           VALIDATION
        =============================== */

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        /* ===============================
           CHECK EXISTING USER
        =============================== */

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        /* ===============================
           HASH PASSWORD
        =============================== */

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            password,
            salt
        );

        /* ===============================
           CREATE USER
        =============================== */

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "customer",
            createdAt: new Date()
        });

        /* ===============================
           GENERATE TOKEN
        =============================== */

        const token = generateToken(
            user._id,
            user.role
        );

        /* ===============================
           RESPONSE
        =============================== */

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error("SIGNUP ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

});

/* =========================================================
   LOGIN
========================================================= */

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        /* ===============================
           VALIDATION
        =============================== */

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        /* ===============================
           FIND USER
        =============================== */

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        /* ===============================
           VERIFY PASSWORD
        =============================== */

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        /* ===============================
           GENERATE TOKEN
        =============================== */

        const token = generateToken(
            user._id,
            user.role
        );

        /* ===============================
           UPDATE LAST LOGIN
        =============================== */

        user.lastLogin = new Date();

        await user.save();

        /* ===============================
           RESPONSE
        =============================== */

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error("LOGIN ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

});

/* =========================================================
   PROFILE
========================================================= */

router.get(
    "/profile",
    authMiddleware,
    async (req, res) => {

        try {

            const user = await User.findById(req.user.id)
                .select("-password");

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            res.status(200).json({
                success: true,
                user
            });

        } catch (error) {

            console.error("PROFILE ERROR:", error);

            res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });

        }

    }
);

/* =========================================================
   UPDATE PROFILE
========================================================= */

router.put(
    "/update-profile",
    authMiddleware,
    async (req, res) => {

        try {

            const {
                name
            } = req.body;

            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            user.name = name || user.name;

            await user.save();

            res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });

        } catch (error) {

            console.error("UPDATE PROFILE ERROR:", error);

            res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });

        }

    }
);

/* =========================================================
   CHANGE PASSWORD
========================================================= */

router.put(
    "/change-password",
    authMiddleware,
    async (req, res) => {

        try {

            const {
                oldPassword,
                newPassword
            } = req.body;

            if (!oldPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required"
                });
            }

            const user = await User.findById(req.user.id);

            const isMatch = await bcrypt.compare(
                oldPassword,
                user.password
            );

            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Old password is incorrect"
                });
            }

            const hashedPassword = await bcrypt.hash(
                newPassword,
                10
            );

            user.password = hashedPassword;

            await user.save();

            res.status(200).json({
                success: true,
                message: "Password updated successfully"
            });

        } catch (error) {

            console.error("CHANGE PASSWORD ERROR:", error);

            res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });

        }

    }
);

/* =========================================================
   VERIFY TOKEN
========================================================= */

router.get(
    "/verify-token",
    authMiddleware,
    async (req, res) => {

        res.status(200).json({
            success: true,
            message: "Token is valid",
            user: req.user
        });

    }
);

module.exports = router;