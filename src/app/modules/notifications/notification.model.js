const {model, Schema} = require("mongoose");
const notificationSchema= new Schema(
    {
        text: { 
            type: String, 
            required: true
        },
        title: {
            type: String,
            default: ""
        },
        read: { 
            type: Boolean, 
            default: false,
            required: false
        },
        user: { 
            type: Schema.Types.ObjectId, 
            ref: "User",
            required: true
        },
        type: {
            type: String,
            required: false
        }
    },
    { timestamps: true }
);

const Notification = model("Notification", notificationSchema);
module.exports = Notification;