const Food = require("../models/Food");

exports.getFoods = async (req, res) => {

    const seedFoods = [
        {
            name: "Cheese Burger",
            description: "Crispy beef patty, cheddar, fresh lettuce, pickles & our secret house sauce.",
            price: 199,
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400",
            category: "burgers",
            rating: 4.9,
            tag: "Best Seller"
        },
        {
            name: "Italian Pizza",
            description: "Premium pepperoni, fresh mozzarella, hand-crushed tomatoes, fresh basil.",
            price: 349,
            image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400",
            category: "pizza",
            rating: 4.8,
            tag: "Hot Pick"
        },
        {
            name: "Spicy Hot Wings",
            description: "Deep-fried wings tossed in our signature ghost-pepper hot sauce.",
            price: 249,
            image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=400",
            category: "chicken",
            rating: 4.7,
            tag: "Trending"
        },
        {
            name: "Premium Mojito",
            description: "Mint, fresh lime juice, raw sugar, premium soda & crushed ice.",
            price: 129,
            image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=400",
            category: "drinks",
            rating: 4.6,
            tag: "Refreshing"
        },
        {
            name: "Tandoori Platter",
            description: "Slow-roasted tandoori kebabs served with mint chutney and caramelised onions.",
            price: 399,
            image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=400",
            category: "chicken",
            rating: 4.9,
            tag: "Chef Special"
        },
        {
            name: "Double Cheese Pizza",
            description: "Extra mozzarella, creamy cheddar, truffle oil drizzle & signature herb glaze.",
            price: 429,
            image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=400",
            category: "pizza",
            rating: 4.8,
            tag: "Premium"
        },
        {
            name: "BBQ Bacon Burger",
            description: "Smoked bacon, crispy onion rings, cheddar cheese, and rich honey BBQ sauce.",
            price: 249,
            image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=400",
            category: "burgers",
            rating: 4.9,
            tag: "New Arrival"
        },
        {
            name: "Crispy Chicken Burger",
            description: "Golden-fried chicken breast, spicy mayo, brioche bun, and pickles.",
            price: 179,
            image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?q=80&w=400",
            category: "burgers",
            rating: 4.7,
            tag: "Popular"
        },
        {
            name: "Paneer Tikka Pizza",
            description: "Tandoori paneer tikka, capsicum, red onions, and mint mayo drizzle.",
            price: 299,
            image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=400",
            category: "pizza",
            rating: 4.8,
            tag: "Veggie Special"
        },
        {
            name: "Garlic Parmesan Wings",
            description: "Crispy wings tossed in garlic butter and aged parmesan cheese.",
            price: 269,
            image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=400",
            category: "chicken",
            rating: 4.6,
            tag: "Must Try"
        },
        {
            name: "Fresh Lemonade",
            description: "Squeezed fresh lemons, pure cane sugar, and chilled mineral water.",
            price: 89,
            image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=400",
            category: "drinks",
            rating: 4.5,
            tag: "Ice Cold"
        },
        {
            name: "Mango Lassi",
            description: "Creamy yogurt drink blended with sweet Alphonso mangoes and cardamom.",
            price: 109,
            image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=400",
            category: "drinks",
            rating: 4.9,
            tag: "Traditional"
        },
        {
            name: "Biryani Feast",
            description: "Fragrant basmati rice cooked with tender spiced chicken, saffron, and mint.",
            price: 349,
            image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=400",
            category: "chicken",
            rating: 4.9,
            tag: "King Feast"
        }
    ];

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