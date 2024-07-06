const {model, Schema} = require("mongoose");

const salonSchema = new Schema(
    {
        openingTimes: {
            type: String,
            required: false
        },
        openingDays: {
            type: String,
            required: false
        },
        description: {
            type: String,
            required: false
        },
        featured: {
            type: Boolean,
            default: false,
            required: false
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rating: {
            type: Number,
            default: 0
        },
        totalRating: {
            type: Number,
            default: 0
        },
        gallery: [],
    },
    {timestamps: true}
);

const Salon = model("Salon", salonSchema);
module.exports = Salon;
