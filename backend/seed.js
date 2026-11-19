/* ============================================================
   RKR RESTAURANT — DATABASE SEED FILE
   Run once: node seed.js
   Seeds the database with all unique menu items from menuData.js
   ============================================================ */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const Food = require('./models/Food');

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI environment variable is missing in .env file.");
  process.exit(1);
}

// Load static menu items dynamically from menuData.js
global.window = {};
const menuDataPath = path.join(__dirname, '../frontend/js/menuData.js');
const menuDataContent = fs.readFileSync(menuDataPath, 'utf8');

// Evaluate menuData.js to populate window.STATIC_MENU
try {
  eval(menuDataContent);
} catch (evalError) {
  console.error('❌ Failed to evaluate menuData.js:', evalError.message);
  process.exit(1);
}

const foods = window.STATIC_MENU;

if (!foods || !Array.isArray(foods) || foods.length === 0) {
  console.error('❌ No menu items found in window.STATIC_MENU');
  process.exit(1);
}

async function seedDatabase() {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing food items
    await Food.deleteMany({});
    console.log('🗑️  Cleared existing food items');

    // Prepare food objects (mapping all attributes and handling missing ones)
    const foodsToInsert = foods.map(item => ({
      name: item.name,
      description: item.description || '',
      price: item.price,
      image: item.image || '',
      category: item.category,
      rating: parseFloat(item.rating) || 4.8,
      tag: item.tag || ''
    }));

    // Insert all items
    await Food.insertMany(foodsToInsert);
    console.log(`🍔 Successfully seeded ${foodsToInsert.length} food items!`);

    // Print count by category
    const categoryCounts = {};
    foodsToInsert.forEach(f => {
      categoryCounts[f.category] = (categoryCounts[f.category] || 0) + 1;
    });

    console.log('\n📋 Items added by category:');
    for (const [category, count] of Object.entries(categoryCounts)) {
      console.log(`   🔸 ${category.charAt(0).toUpperCase() + category.slice(1)} : ${count} items`);
    }

    console.log('\n✅ Seed complete! Restart your server and refresh your site.');

  } catch (error) {
    console.error('❌ Seed failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

seedDatabase();