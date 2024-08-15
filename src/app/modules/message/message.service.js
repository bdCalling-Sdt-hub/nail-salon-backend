const Conversation = require('../conversation/conversation.model');
const Message = require('./message.model');


exports.sendMessage=async(payload)=>{
    const { conversationId, sender, message }= payload;
        
    const messageData = {
        conversationId: conversationId,
        sender: sender,
        message: message
    };

    // save to DB  
    const response = await Message.create(messageData);
    io.to(conversationId).emit("getMessage", response);

    return response;
}

exports.getMessage=async(conversationId, query, user)=>{

    const {page} = query;
    const pages = parseInt(page) || 1;
    const size = 10;
    const skip = (pages - 1) * size;

    const conversations = await Conversation.findOne({_id: conversationId}).populate({path: "participants", select: "name profileImage"});
    const userData = conversations?.participants?.find(participant => participant._id.toString() !== user._id.toString());

    const messages = await Message.find({conversationId: conversationId}).sort({ createdAt: -1 }).limit(size).skip(skip);
    const total = messages?.length
    const totalPage = Math.ceil(total / size);
    return {
        user: userData,
        messages: messages,
        meta: {
            page: pages,
            totalPage,
            total
        }
    };
}