const { Schema, model } = require("mongoose");

const MessageSchema = new Schema(
  {
    conversationId: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      enum: ["Text", "Deal", "Image"],
    },
    deal: {
      type: {},
      default: null,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: false,
    },
    gigId: {
      type: String,
      ref: "Gig",
    },
  },
  { timestamps: true }
);

const Message = model("message", MessageSchema);
module.exports = Message;
