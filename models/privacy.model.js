const mongoose = require("mongoose")
const privacySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
},{ timestamps: true });

const PrivacySchema = mongoose.model("privacy", privacySchema);
module.exports = PrivacySchema;