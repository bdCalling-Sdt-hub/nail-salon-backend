const { Schema, model } = require("mongoose");

const videoSchema = new Schema(
  {
    video: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    videoDescription: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    wishList: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        comment: {
          type: String,
        },
      },
    ],
    gig: {
      type: Schema.Types.ObjectId,
      ref: "Gig",
    },
    artist: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Video = model("Video", videoSchema);
module.exports = Video;
