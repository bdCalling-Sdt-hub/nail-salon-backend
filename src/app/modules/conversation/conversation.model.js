const { model, Schema } = require("mongoose")

const conversationSchema = new model(
    {
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    }
)
const Conversation = model("Conversation", conversationSchema);
module.exports=Conversation;