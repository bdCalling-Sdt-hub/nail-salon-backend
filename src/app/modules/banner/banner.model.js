const mongoose = require("mongoose")

const bannerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        bannerImage: {
            type: String,
            required: true
        }
    },
    {timestamps: true}
)

const Banner = mongoose.model("Banner", bannerSchema);
module.exports = Banner;