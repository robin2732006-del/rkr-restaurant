/* ============================================================
   RKR RESTAURANT — DATABASE SEED FILE (addMenu.js)
   Seeds the database with all 60 menu items dynamically
   ============================================================ */

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const Food = require("./models/Food");

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// Load static menu items dynamically from menuData.js
global.window = {};
const menuDataPath = path.join(__dirname, "../frontend/js/menuData.js");
const menuDataContent = fs.readFileSync(menuDataPath, "utf8");

// Evaluate menuData.js to populate window.STATIC_MENU
try {
  eval(menuDataContent);
} catch (evalError) {
  console.error("❌ Failed to evaluate menuData.js:", evalError.message);
  process.exit(1);
}

const foods = window.STATIC_MENU;

if (!foods || !Array.isArray(foods) || foods.length === 0) {
  console.error("❌ No menu items found in window.STATIC_MENU");
  process.exit(1);
}

async function seed() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Food.deleteMany({});
    console.log("🗑️  Cleared old food items");

    const foodsToInsert = foods.map(item => ({
      name: item.name,
      description: item.description || "",
      price: item.price,
      image: item.image || "",
      category: item.category,
      rating: parseFloat(item.rating) || 4.8,
      tag: item.tag || ""
    }));

    await Food.insertMany(foodsToInsert);
    console.log(`\n🍔 Successfully seeded ${foodsToInsert.length} food items!\n`);

    const categoryCounts = {};
    foodsToInsert.forEach(f => {
      categoryCounts[f.category] = (categoryCounts[f.category] || 0) + 1;
    });

    console.log("📋 Items added by category:");
    for (const [category, count] of Object.entries(categoryCounts)) {
      console.log(`   🔸 ${category.charAt(0).toUpperCase() + category.slice(1)} : ${count} items`);
    }

    console.log("\n✅ Done! Restart server & refresh your website.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();