const httpStatus = require("http-status");
const Community = require("../models/community.model");
const sendResponse = require("../shared/sendResponse");
const catchAsync = require("../shared/catchAsync");

exports.createCommunity = catchAsync(async (req, res) => {
  const user = req.user;
  const payload = { communityCreator: user._id, ...req.body };
  const result = await Community.create(payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Community created successfully",
    data: result,
  });
});

exports.getCommunity = catchAsync(async (req, res) => {
  const user = req.user;
  const whereCondition =
    user.role === "USER"
      ? { communityCreator: user._id }
      : { communityMembers: { $in: [user._id] } };

  const result = await Community.find(whereCondition).populate({
    path: "communityMembers",
    select: "firstName lastName _id image color",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Community retrieved successfully",
    data: result,
  });
});
