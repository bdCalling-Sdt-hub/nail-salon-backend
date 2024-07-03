const {model, Schema} = require("mongoose");

const wishlistSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        service: {
            type: Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        }
    },
    { timestamps: true }
);

const Wishlist = model("Wishlist", wishlistSchema);
module.exports=Wishlist;