const {model, Schema} = require("mongoose");
const messageSchema= new Schema(
    {
        message: {
            type: String,
            required: true,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        conversationId: {
            type: String,
            required: true,
          },
        messageType: {
            type: String,
            enum: ["text", "image"],
            default: "text"
        },

    }
)
const Message = model('Message', messageSchema);
module.exports=Message;