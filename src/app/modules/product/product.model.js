const {model, Schema} = require("mongoose");

const productSchema= new Schema(
    {
        name: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        salon:{
            type: Schema.Types.ObjectId,
            required: true
        },
        productId: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        expiredDate: {
            type: String,
            required: true
        },
    }
);

const Product = model("Product", productSchema);
module.exports = Product;