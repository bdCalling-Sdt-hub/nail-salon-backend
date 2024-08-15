const ConversationService = require("./conversation.service");
const catchAsync = require("../../../shared/catchAsync"); 
const sendResponse = require("../../../shared/sendResponse"); 
const { StatusCodes } = require("http-status-codes");

exports.createConversation=catchAsync(async(req, res)=>{
    const user = req.user;
    const otherUser = req.params.id
    const participants = [user?._id, otherUser];
    const conversation = await ConversationService.createConversation(participants);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Create conversation Successfully",
        data: conversation
    })
})

exports.getConversation=catchAsync(async(req, res)=>{
    const user = req.user;
    const query = req.query;
    const salons = await ConversationService.getConversation(user, query)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Conversation Retrieve Successfully",
        data: salons
    })
})