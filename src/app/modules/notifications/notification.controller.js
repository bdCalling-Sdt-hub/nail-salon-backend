const NotificationService = require("./notification.service");
const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const { StatusCodes } = require("http-status-codes");

exports.adminNotifications= catchAsync(async(req, res)=>{
    const result = await NotificationService.adminNotifications(req.query);
    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Notifications Retrieve Successfully",
        data: result
    })
});

exports.notifications= catchAsync(async(req, res)=>{
    const user=req.user;
    const result = await NotificationService.notifications(user, req.query);
    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Notifications Retrieve Successfully",
        data: result
    })
});

exports.readNotification= catchAsync(async(req, res)=>{
    const user=req.user;
    await NotificationService.readNotification(user);
    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Notifications Updated Successfully"
    })
});