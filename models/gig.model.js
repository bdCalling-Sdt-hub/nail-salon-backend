const { Schema, model } = require("mongoose");

const gigSchema = new Schema(
  {
    contentName: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    skillLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Professional"],
      required: true,
    },
    searchTags: [{ type: String }],
    thumbnail: {
      type: String,
    },
    basicPackage: {
      required: true,
      type: {
        serviceDescription: {
          type: String,
          required: true,
        },
        price: {
          type: String,
          required: true,
        },
        totalService: {
          type: Number,
          required: true,
        },
      },
    },
    standardPackage: {
      required: true,
      type: {
        serviceDescription: {
          type: String,
          required: true,
        },
        price: {
          type: String,
          required: true,
        },
        totalService: {
          type: Number,
          required: true,
        },
      },
    },
    premiumPackage: {
      required: true,
      type: {
        serviceDescription: {
          type: String,
          required: true,
        },
        price: {
          type: String,
          required: true,
        },
        totalService: {
          type: Number,
          required: true,
        },
      },
    },
    ratings: {
      rate: {
        type: String,
        default: 0 // Default value for rate
      },
      count: {
        type: Number,
        default: 0 // Default value for count
      }
    }
    ,
    category: {
      type: String,
      required: true,
    },
    event: {
      type: String,
      required: true,
    },
    artist: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
  },
  { timestamps: true }
);

const Gig = model("Gig", gigSchema);

module.exports = Gig;