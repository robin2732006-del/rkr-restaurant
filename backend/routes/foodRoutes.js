const express = require("express");
const { getFoods, createFood } = require("../controllers/foodController");

const router = express.Router();

router.get("/", getFoods);
router.post("/", createFood);

module.exports = router;