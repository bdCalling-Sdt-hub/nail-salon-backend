const Conversation = require('./conversation.model');
const Message = require('../message/message.model');

exports.createConversation=async(payload)=>{
    const existingConversation = await Conversation.findOne({
        participants: { $all: payload }
    });

    if(existingConversation){
        return existingConversation
    }
    const conversation = await Conversation.create({participants: payload});
    return conversation;
}

exports.getConversation=async(user, query)=>{
    const {page} = query;

    const pages = parseInt(page) || 1;
    const size = 10;
    const skip = (pages - 1) * size;

    const conversations = await Conversation.find({participants: {$in : user._id}}).populate({path: "participants", select: "name profileImage"}).limit(size).skip(skip);

    // Use Promise.all to handle the asynchronous operations inside the map
    const filteredConversations = await Promise.all(conversations?.map(async (conversation) => {
        // Find the other participant (not the current user)
        const otherParticipant = conversation?.participants?.find(participant => participant?._id.toString() !== user?._id);

         // Get the last message of the conversation
         const lastMessage = await Message.findOne({ conversationId: conversation._id })
         .sort({ createdAt: -1 }).select("message createdAt")

        // Return the desired structure
        return {
            _id: conversation._id,
            user: {
                name: otherParticipant?.name,
                profileImage: otherParticipant?.profileImage
            },
            lastMessage: lastMessage
        };
    }));

    

    return {
        conversations: filteredConversations,
        pagination: {
            page: pages,
            total: conversations?.length || 0
        }
    };
}