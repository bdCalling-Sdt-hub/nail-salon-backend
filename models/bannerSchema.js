const mongoose = require("mongoose")
const bannerSchema = new mongoose.Schema({
    banner:{
        type: String,
        required: true
    }
},{ timestamps: true });

const Banner = mongoose.model("banner", bannerSchema);
module.exports = Banner;