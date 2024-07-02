const mongoose = require("mongoose");

const FAQSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    }
},{ timestamps: true });

const FAQ = mongoose.model("faq", FAQSchema);
module.exports = FAQ;