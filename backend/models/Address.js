const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({

    user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User"

    },

    fullAddress: String,

    city: String,

    state: String,

    country: String,

    pincode: String

});

module.exports = mongoose.model(
    "Address",
    addressSchema
);