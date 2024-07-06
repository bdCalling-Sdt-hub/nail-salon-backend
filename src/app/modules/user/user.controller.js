const sendResponse = require("../../../shared/sendResponse");
const catchAsync = require("../../../shared/catchAsync");
const UserService = require("./user.server");
const { StatusCodes } = require("http-status-codes");

exports.getUserList=catchAsync(async(req, res)=>{

    const users = await UserService.getUserList(req.query);
    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "User List Retrieved Successfully",
        data: users
    })
})