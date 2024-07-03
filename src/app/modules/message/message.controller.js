const catchAsync = require("../../../shared/catchAsync"); 
const sendResponse = require("../../../shared/sendResponse"); 
const { StatusCodes } = require("http-status-codes");
const MessageController = require("./message.service");


exports.sendMessage=catchAsync(async(req, res)=>{
    const message = await MessageController.sendMessage(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Send Message Successfully",
        data: message
    })
});

exports.getMessage= catchAsync(async(req, res)=>{
    const id = req.params.id;
    const messages = await MessageController.getMessage(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Message Retrieve Successfully",
        data: messages
    })
});