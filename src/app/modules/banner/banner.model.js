const mongoose = require("mongoose")

const bannerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true
        },
        bannerImage: {
            type: String,
            require: true
        }
    }
)

const Banner = mongoose.model("Banner", bannerSchema);
module.exports = Banner;