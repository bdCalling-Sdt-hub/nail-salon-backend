const httpStatus = require("http-status");
const ApiError = require("../errors/ApiError");
const sendResponse = require("../shared/sendResponse");
const Message = require("../models/message.model");
const catchAsync = require("../shared/catchAsync");

// created message
exports.createMessageToDB = catchAsync(async (req, res, next) => {
  const message = await Message.create({ ...req.body });
  console.log(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: true,
    message: "Message Created Successfully",
    data: message,
  });
});

// get message by conversation ID
exports.getMessageFromDB = catchAsync(async (req, res, next) => {
  const messages = await Message.find({
    conversationId: req.params.conversationId,
  }).sort({ createdAt: -1 });

  if (!messages) {
    throw new ApiError(404, "There is no Message !");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: true,
    message: "Message Retrieve Successfully",
    data: messages,
  });
});

exports.deleteMessage = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const message = await Message.findById(id);
  if (!message) {
    throw ApiError(404, "There is No Message !");
  }

  await Message.findByIdAndDelete(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: true,
    message: "Message Deleted Successfully",
  });
});
