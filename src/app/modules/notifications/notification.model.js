const {model, Schema} = require("mongoose");
const notificationSchema= new Schema(
    {
        message: { 
            type: String, 
            required: true
        },
        read: { 
            type: Boolean, 
            default: false
        },
        user: { 
            type: Schema.Types.ObjectId, 
            ref: "User"
        }
    },
    { timestamps: true }
);

const Notification = model("Notification", notificationSchema);
module.exports = Notification;