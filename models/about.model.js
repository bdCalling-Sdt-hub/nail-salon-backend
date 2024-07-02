const mongoose = require("mongoose")
const aboutUsSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
},{ timestamps: true });

const AboutUsSchema = mongoose.model("about", aboutUsSchema);
module.exports = AboutUsSchema; 