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
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        gallery: [],
    },
    {timestamps: true}
);

const Salon = model("Salon", salonSchema);
module.exports = Salon;
