const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 35

    },
    description: {
        type: String,
        trim: true,
        required: true,
        maxlength: 1000
    },
    price: {
        type: Number,
        trim: true,
        required: true,
        maxlength: 35
    },
    category: {
        type: ObjectId,
        ref: "Category",
        required: true
    },
    stock: {
            type: Number
    },
    sold: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        contentType : String
    }
}, {timestamps: true});

module.exports = mongoose.model("Product", productSchema);