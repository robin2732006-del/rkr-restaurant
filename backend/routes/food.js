const express = require("express");
const Food = require("../models/Food");

const router = express.Router();

router.post("/add", async (req, res) => {

    try {

        const food = new Food(req.body);

        await food.save();

        res.json({
            message: "Food Added Successfully"
        });

    } catch (error) {

        res.json({
            message: error.message
        });
    }
});

router.get("/", async (req, res) => {

    try {

        const foods = await Food.find();

        res.json(foods);

    } catch (error) {

        res.json({
            message: error.message
        });
    }
});

module.exports = router;