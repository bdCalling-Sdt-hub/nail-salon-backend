const httpStatus = require("http-status");
const ApiError = require("../errors/ApiError");
const Conversation = require("../models/conversation.model");
const sendResponse = require("../shared/sendResponse");
const catchAsync = require("../shared/catchAsync");

exports.createConversationToDB = catchAsync(async (req, res, next) => {
  const existingConversation = await Conversation.findOne({
    $or: [
      { members: { $all: [req.body.senderId, req.body.receiverId] } },
      { members: { $all: [req.body.receiverId, req.body.senderId] } },
    ],
  });

  if (existingConversation) {
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      status: true,
      message: "Already Exist",
      data: existingConversation,
    });
  }

  const conversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  const result = await conversation.save();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: true,
    message: "Conversation Created Successfully!!!",
    data: result,
  });
});

exports.getConversationsFromDB = catchAsync(async (req, res, next) => {
  const id = req.user._id;
  const conversations = await Conversation.find({
    members: { $in: [id] },
  }).populate({
    path: "members",
    select: "firstName lastName _id image color",
  });

  if (!conversations) {
    throw new ApiError(404, "There is no User!");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: true,
    message: "Conversation Retrieve Successfully",
    data: conversations,
  });
});

exports.getSingleConversationFromDB = catchAsync(async (req, res, next) => {
  const conversation = await Conversation.findOne({
    members: { $all: [req.params.firstUserId, req.params.secondUserId] },
  }).populate({
    path: "members",
    select: "firstName lastName _id image color",
  });

  if (!conversation) {
    throw new ApiError(404, "There is no Conversation!");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: true,
    message: "Single Conversation Retrieve Successfully",
    data: conversation,
  });
});
