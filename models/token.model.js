const { Schema, model } = require("mongoose");

const tokenSchema = new Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required"],
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order ID is required"],
    },
  },
  { timestamps: true }
);


tokenSchema.statics.isExistToken = async (token) => {
 return await Token.findOne({ token: token });
}

const Token = model("Token", tokenSchema);

module.exports = Token;
