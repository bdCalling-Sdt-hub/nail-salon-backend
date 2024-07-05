const { model, Schema } = require("mongoose");

const reviewSchema = new Schema(
    {
        salon: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        comment: {
            type: String,
            ref: "User",
            required: true,
        },

    }
);

const Review = model("Review", reviewSchema);
module.exports = Review;
