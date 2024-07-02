const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    colors:{
        type: [String],
        required: true
    },
    image:{

        type: String,
        required: true
    }
},{ timestamps: true });

const CategorySchema = mongoose.model("category", categorySchema);
module.exports = CategorySchema;
