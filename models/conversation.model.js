const { Schema, model } = require('mongoose')

const ConversationSchema = new Schema(
    {
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            }
        ]
    },
    { timestamps: true }
);

const Conversation = model('conversation', ConversationSchema);
module.exports = Conversation;