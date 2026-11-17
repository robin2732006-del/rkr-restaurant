const fs = require("fs");
const path = require("path");
const Food = require("../models/Food");

// Load static menu items dynamically from menuData.js as fallback
let seedFoods = [];
try {
    const globalWindow = global.window || {};
    global.window = globalWindow;
    const menuDataPath = path.join(__dirname, "../../frontend/js/menuData.js");
    if (fs.existsSync(menuDataPath)) {
        const menuDataContent = fs.readFileSync(menuDataPath, "utf8");
        eval(menuDataContent);
        seedFoods = global.window.STATIC_MENU || [];
    }
} catch (evalError) {
    console.error("⚠️ Failed to load static menuData.js fallback in controller:", evalError.message);
}

exports.getFoods = async (req, res) => {
    try {

        // Check if MongoDB is connected, if not, fallback to in-memory seed foods immediately
        const mongoose = require("mongoose");
        if (mongoose.connection.readyState !== 1) {
            console.log("⚠️ MongoDB is not active. Falling back to in-memory dynamic menus.");
            return res.json({
                success: true,
                foods: seedFoods
            });
        }

        let foods = await Food.find();

        if (foods.length === 0) {
            console.log("Seeding database with premium menu items...");
            await Food.insertMany(seedFoods);
            foods = await Food.find();
        }

        res.json({
            success: true,
            foods
        });

    } catch (error) {

        console.log("⚠️ Mongoose find error, returning in-memory fail-safe menu list:", error.message);
        res.json({
            success: true,
            foods: seedFoods
        });

    }

};

exports.createFood = async (req, res) => {

    try {

        const food = await Food.create(req.body);

        res.status(201).json({
            success: true,
            food
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};