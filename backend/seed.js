/* ============================================================
   RKR RESTAURANT — DATABASE SEED FILE
   Run once: node seed.js
   Adds 40 menu items to your MongoDB database
   ============================================================ */

const mongoose = require('mongoose');
const Food = require('./models/Food'); // adjust path if needed

// ✅ Paste your MongoDB connection string here
const MONGO_URI = 'mongodb+srv://robink742006_db_user:Robin74762006@cluster0.ktposdu.mongodb.net/rkr_restaurant?retryWrites=true&w=majority';

const foods = [

  // ── BURGERS (10) ─────────────────────────────────────────────
  {
    name: 'Classic Smash Burger',
    description: 'Double smashed patty, cheddar, pickles & special RKR sauce',
    price: 199,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400',
    category: 'burgers',
    rating: 4.9,
    tag: '🔥 Hot'
  },
  {
    name: 'BBQ Bacon Burger',
    description: 'Smoky BBQ sauce, crispy bacon strips, caramelised onions',
    price: 249,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=400',
    category: 'burgers',
    rating: 4.8,
    tag: '⭐ Popular'
  },
  {
    name: 'Spicy Jalapeño Burger',
    description: 'Fresh jalapeños, pepper jack cheese, chipotle mayo',
    price: 219,
    image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?q=80&w=400',
    category: 'burgers',
    rating: 4.7,
    tag: '🌶️ Spicy'
  },
  {
    name: 'Mushroom Swiss Burger',
    description: 'Sautéed mushrooms, melted Swiss cheese, garlic aioli',
    price: 229,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=400',
    category: 'burgers',
    rating: 4.6,
    tag: ''
  },
  {
    name: 'Veggie Avocado Burger',
    description: 'Black bean patty, fresh avocado, tomato salsa, lettuce',
    price: 189,
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?q=80&w=400',
    category: 'burgers',
    rating: 4.5,
    tag: '🌿 Veg'
  },
  {
    name: 'Double Trouble Burger',
    description: 'Two beef patties, double cheese, secret RKR sauce',
    price: 299,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=400',
    category: 'burgers',
    rating: 4.9,
    tag: '🔥 Hot'
  },
  {
    name: 'Crispy Chicken Burger',
    description: 'Crunchy fried chicken fillet, coleslaw, honey mustard',
    price: 209,
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=400',
    category: 'burgers',
    rating: 4.7,
    tag: '⭐ Popular'
  },
  {
    name: 'Truffle Royale Burger',
    description: 'Wagyu patty, truffle mayo, arugula, aged cheddar',
    price: 349,
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?q=80&w=400',
    category: 'burgers',
    rating: 4.9,
    tag: '👑 Premium'
  },
  {
    name: 'Korean BBQ Burger',
    description: 'Gochujang glaze, kimchi slaw, sesame brioche bun',
    price: 259,
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=400',
    category: 'burgers',
    rating: 4.8,
    tag: '🆕 New'
  },
  {
    name: 'Egg & Cheese Breakfast Burger',
    description: 'Fried egg, American cheese, hash brown, sriracha',
    price: 179,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400',
    category: 'burgers',
    rating: 4.6,
    tag: ''
  },

  // ── PIZZA (10) ───────────────────────────────────────────────
  {
    name: 'Margherita Classic',
    description: 'San Marzano tomato, fresh mozzarella, basil, extra virgin olive oil',
    price: 299,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=400',
    category: 'pizza',
    rating: 4.8,
    tag: '🌿 Veg'
  },
  {
    name: 'Pepperoni Feast',
    description: 'Double pepperoni, mozzarella, spicy tomato base',
    price: 349,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=400',
    category: 'pizza',
    rating: 4.9,
    tag: '🔥 Hot'
  },
  {
    name: 'BBQ Chicken Pizza',
    description: 'Grilled chicken, BBQ sauce, red onion, fresh coriander',
    price: 369,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400',
    category: 'pizza',
    rating: 4.8,
    tag: '⭐ Popular'
  },
  {
    name: 'Four Cheese Pizza',
    description: 'Mozzarella, gorgonzola, parmesan, ricotta blend',
    price: 389,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400',
    category: 'pizza',
    rating: 4.7,
    tag: '👑 Premium'
  },
  {
    name: 'Spicy Paneer Pizza',
    description: 'Tandoori paneer, capsicum, onion, mint chutney base',
    price: 329,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=400',
    category: 'pizza',
    rating: 4.6,
    tag: '🌶️ Spicy'
  },
  {
    name: 'Veggie Supreme Pizza',
    description: 'Bell peppers, olives, mushrooms, corn, jalapeños',
    price: 319,
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?q=80&w=400',
    category: 'pizza',
    rating: 4.5,
    tag: '🌿 Veg'
  },
  {
    name: 'Peri Peri Chicken Pizza',
    description: 'Peri peri chicken, caramelised onions, mozzarella cheese blend',
    price: 359,
    image: 'https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?q=80&w=400',
    category: 'pizza',
    rating: 4.8,
    tag: '🔥 Hot'
  },
  {
    name: 'Truffle Mushroom Pizza',
    description: 'Truffle oil, wild mushrooms, fresh thyme, mozzarella',
    price: 419,
    image: 'https://images.unsplash.com/photo-1548369937-47519962c11a?q=80&w=400',
    category: 'pizza',
    rating: 4.9,
    tag: '👑 Premium'
  },
  {
    name: 'Prawn & Garlic Pizza',
    description: 'Tiger prawns, roasted garlic, cream sauce, fresh parsley',
    price: 399,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=400',
    category: 'pizza',
    rating: 4.7,
    tag: '🆕 New'
  },
  {
    name: 'Nutella Dessert Pizza',
    description: 'Nutella spread, banana slices, crushed hazelnuts, icing sugar',
    price: 279,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=400',
    category: 'pizza',
    rating: 4.8,
    tag: '🍫 Sweet'
  },

  // ── CHICKEN (10) ─────────────────────────────────────────────
  {
    name: 'Butter Chicken',
    description: 'Tender chicken in rich tomato-butter gravy, served with naan',
    price: 279,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=400',
    category: 'chicken',
    rating: 4.9,
    tag: '⭐ Popular'
  },
  {
    name: 'Crispy Fried Chicken',
    description: '8-spice crispy coating, served with signature dipping sauce',
    price: 229,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=400',
    category: 'chicken',
    rating: 4.8,
    tag: '🔥 Hot'
  },
  {
    name: 'Chicken Shawarma Wrap',
    description: 'Marinated chicken, garlic sauce, pickles, crispy lavash',
    price: 199,
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?q=80&w=400',
    category: 'chicken',
    rating: 4.7,
    tag: '⭐ Popular'
  },
  {
    name: 'Grilled Lemon Herb Chicken',
    description: 'Grilled chicken breast, lemon zest, rosemary, garden salad',
    price: 299,
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c3?q=80&w=400',
    category: 'chicken',
    rating: 4.6,
    tag: '🌿 Healthy'
  },
  {
    name: 'Chicken Tikka',
    description: 'Tandoor-smoked tikka, mint chutney, fresh onion rings',
    price: 259,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=400',
    category: 'chicken',
    rating: 4.8,
    tag: '🌶️ Spicy'
  },
  {
    name: 'Nashville Hot Chicken',
    description: 'Fiery cayenne glaze, pickled cucumber, toasted brioche',
    price: 249,
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=400',
    category: 'chicken',
    rating: 4.7,
    tag: '🔥 Hot'
  },
  {
    name: 'Chicken Caesar Salad',
    description: 'Romaine lettuce, parmesan, croutons, classic Caesar dressing',
    price: 219,
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=400',
    category: 'chicken',
    rating: 4.5,
    tag: '🌿 Healthy'
  },
  {
    name: 'Dragon Fire Wings',
    description: '8 wings tossed in dragon sauce, served with blue cheese dip',
    price: 239,
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=400',
    category: 'chicken',
    rating: 4.9,
    tag: '🌶️ Spicy'
  },
  {
    name: 'Chicken Quesadilla',
    description: 'Grilled chicken, cheddar cheese, peppers, sour cream',
    price: 209,
    image: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?q=80&w=400',
    category: 'chicken',
    rating: 4.6,
    tag: '🆕 New'
  },
  {
    name: 'Chicken Biryani',
    description: 'Dum-cooked basmati rice, whole spices, saffron, raita',
    price: 319,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=400',
    category: 'chicken',
    rating: 4.9,
    tag: '⭐ Popular'
  },

  // ── DRINKS (10) ──────────────────────────────────────────────
  {
    name: 'Mango Lassi',
    description: 'Chilled Alphonso mango, fresh yoghurt, rose water',
    price: 99,
    image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?q=80&w=400',
    category: 'drinks',
    rating: 4.9,
    tag: '⭐ Popular'
  },
  {
    name: 'Classic Cold Coffee',
    description: 'Double-shot espresso, chilled milk, vanilla ice cream',
    price: 119,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=400',
    category: 'drinks',
    rating: 4.8,
    tag: '☕ Coffee'
  },
  {
    name: 'Fresh Lime Soda',
    description: 'Freshly squeezed lime, soda water, black salt, mint',
    price: 79,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=400',
    category: 'drinks',
    rating: 4.7,
    tag: '🍋 Fresh'
  },
  {
    name: 'Strawberry Milkshake',
    description: 'Fresh strawberries, full-cream milk, whipped cream',
    price: 139,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=400',
    category: 'drinks',
    rating: 4.8,
    tag: '🍓 Sweet'
  },
  {
    name: 'Watermelon Cooler',
    description: 'Blended watermelon, lemon, fresh basil, crushed ice',
    price: 89,
    image: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?q=80&w=400',
    category: 'drinks',
    rating: 4.6,
    tag: '🆕 New'
  },
  {
    name: 'Chocolate Brownie Shake',
    description: 'Dark chocolate, brownie chunks, Oreo crumble, caramel drizzle',
    price: 159,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=400',
    category: 'drinks',
    rating: 4.9,
    tag: '🍫 Sweet'
  },
  {
    name: 'Virgin Mojito',
    description: 'Fresh mint leaves, lime juice, sugar syrup, soda water',
    price: 99,
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=400',
    category: 'drinks',
    rating: 4.7,
    tag: '🌿 Fresh'
  },
  {
    name: 'Rose Sharbat',
    description: 'Rose syrup, chilled milk, sabja seeds, chopped dry fruits',
    price: 79,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=400',
    category: 'drinks',
    rating: 4.5,
    tag: '🌹 Special'
  },
  {
    name: 'Masala Chai',
    description: 'Cardamom, ginger, cinnamon, strong CTC tea, full cream milk',
    price: 59,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=400',
    category: 'drinks',
    rating: 4.8,
    tag: '☕ Hot'
  },
  {
    name: 'Blue Lagoon Mocktail',
    description: 'Blue curacao syrup, fresh lemonade, soda water, cherry garnish',
    price: 129,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400',
    category: 'drinks',
    rating: 4.7,
    tag: '🆕 New'
  }

];

/* ============================================================
   SEED FUNCTION — connects, clears old data, inserts new
   ============================================================ */
async function seedDatabase() {

  try {

    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing food items
    await Food.deleteMany({});
    console.log('🗑️  Cleared existing food items');

    // Insert all 40 items
    await Food.insertMany(foods);
    console.log(`🍔 Successfully seeded ${foods.length} food items!`);

    console.log('\n📋 Items added by category:');
    console.log('   🍔 Burgers : 10 items');
    console.log('   🍕 Pizza   : 10 items');
    console.log('   🍗 Chicken : 10 items');
    console.log('   🥤 Drinks  : 10 items');
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