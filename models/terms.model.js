const mongoose = require("mongoose")
const termsSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
},{ timestamps: true });

const TermsSchema = mongoose.model("terms", termsSchema);
module.exports = TermsSchema; 