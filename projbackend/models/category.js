const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({

    name:{
        type: String,
        maxlength: 35,
        required: true,
        unique: true,
        trim: true
    }
}, {timestamps: true});

module.exports = mongoose.model("Category", categorySchema);