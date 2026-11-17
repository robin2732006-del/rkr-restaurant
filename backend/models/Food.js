const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({

    name: { type: String, required: true },

    description: String,

    price: { type: Number, required: true },

    image: String,

    category: { type: String, required: true },

    rating: { type: Number, default: 4.8 },

    tag: { type: String, default: "" },

    ingredients: [{ type: String }],

    diet: { type: String, default: "Vegetarian" },

    spice: { type: String, default: "Medium" }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "Food",
    foodSchema
);