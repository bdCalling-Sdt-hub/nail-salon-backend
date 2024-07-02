const httpStatus = require("http-status");
const Notification = require("../models/notification.model");
const sendResponse = require("../shared/sendResponse");
const ApiError = require("../errors/ApiError");
const catchAsync = require("../shared/catchAsync");

exports.addNotification = async (payload) => {
  const result = await Notification.create(payload);
  return result;
};

exports.getNotification = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const result = await Notification.find({ user: _id }).sort({ createdAt: -1 });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notification retrieved successfully",
    data: result,
  });
});

exports.readNotifications = catchAsync(async (req, res) => {
  const id = req.user._id;
  await Notification.updateMany({ recipient: id, read: false }, { read: true });

  const total = await Notification.countDocuments({
    recipient: id,
    read: false,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notification read successfully",
    unreadNotifications: total,
  });
});
