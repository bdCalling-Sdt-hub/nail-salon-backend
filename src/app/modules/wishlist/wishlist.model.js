const {model, Schema} = require("mongoose");

const wishlistSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        salon: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    },
    { timestamps: true }
);

const Wishlist = model("Wishlist", wishlistSchema);
module.exports=Wishlist;