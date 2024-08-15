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
            type: Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
        }
    },
    {
        timestamps: true
    }
)
const Message = model('Message', messageSchema);
module.exports=Message;