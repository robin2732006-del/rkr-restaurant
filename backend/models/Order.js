const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    items: [
        {
            name: {
                type: String,
                required: true
            },

            quantity: {
                type: Number,
                required: true
            },

            price: {
                type: Number,
                required: true
            },

            image: {
                type: String,
                default: ""
            },

            description: {
                type: String,
                default: ""
            }
        }
    ],

    totalAmount: {
        type: Number,
        required: true
    },

    deliveryInfo: {
        name: String,
        email: String,
        phone: String,
        address: String
    },

    status: {
        type: String,
        default: "Pending"
    }

},
{
    timestamps: true
}
);

module.exports = mongoose.model("Order", orderSchema);