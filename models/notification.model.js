const { Schema, model } = require("mongoose");

const notificationSchema = new Schema(
  {
    userInfo: {
      name: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
    },
    type: {
      type: String,
      enum: ["comment", "wishlist", "transfer"],
      required: true,
    },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["USER", "ARTIST", "ADMIN"],
      default: "USER",
    },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Notification = model("Notification", notificationSchema);

module.exports = Notification;
