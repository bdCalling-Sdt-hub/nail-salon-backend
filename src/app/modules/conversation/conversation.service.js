const { StatusCodes } = require('http-status-codes')
const ApiError =require('../../../errors/ApiError')
const Conversation = require('./conversation.model');

exports.createConversation=async(payload)=>{
    const existingConversation = await Conversation.findOne({
        participants: { $all: payload }
    });

    if(existingConversation){
        return
    }
    const conversation = await Conversation.create({participants: payload});
    return conversation;
}

exports.getConversation=async(user)=>{
    const salons = await Conversation.find({participants: {$in : user._id}}).populate("participants").populate({
        path: "participants",
        select: "_id name email  profile_image role",
    });
    const filteredConversations = salons.map(conversation => {
        return {
            ...conversation.toObject(),
            participants: conversation.participants.filter(participant => participant._id.toString() !== user._id)
        };
    });
    return filteredConversations;
}