const { StatusCodes } = require('http-status-codes')
const ApiError =require('../../../errors/ApiError')
const Message = require('./message.model');


exports.sendMessage=async(payload)=>{
    const message = await Message.create(payload);
    return message;
}

exports.getMessage=async(conversationId)=>{
    const messages = await Message.find({conversationId: conversationId});
    console.log(messages)
    return messages;
}