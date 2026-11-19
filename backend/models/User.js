const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },



    phone: {
        type: String,
        default: ""
    },

    dob: {
        type: String,
        default: ""
    },

    address: {
        type: String,
        default: ""
    },

    avatar: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        default: ""
    },

    dietaryPreferences: {
        type: [String],
        default: ["non-veg", "spicy"]
    },

    spiceLevel: {
        type: String,
        default: "Medium"
    },

    loyaltyPoints: {
        type: Number,
        default: 750
    },

    tier: {
        type: String,
        default: "Elite Gold"
    },

    savedAddresses: [
        {
            label: { type: String, default: "Home" },
            city: { type: String, default: "Chennai" },
            details: { type: String, default: "" },
            isDefault: { type: Boolean, default: false }
        }
    ],

    notificationSettings: {
        whatsapp: { type: Boolean, default: true },
        promoEmails: { type: Boolean, default: true },
        sms: { type: Boolean, default: false }
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("User", userSchema);