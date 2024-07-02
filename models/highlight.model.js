const { Schema, model } = require("mongoose");

const highlightSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Highlight = model("Highlight", highlightSchema);

module.exports = Highlight;
