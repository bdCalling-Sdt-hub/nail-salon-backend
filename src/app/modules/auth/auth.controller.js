const bcrypt = require("bcrypt");
const sendResponse = require("../../../shared/sendResponse");
const httpStatus = require("http-status");
const catchAsync = require("../../../shared/catchAsync");
// const UserService = require("../user/user.server");
const AuthService = require("./auth.service");
const generateOTP = require("../../../util/generateOTP");
const { StatusCodes } = require("http-status-codes");


exports.register = catchAsync(async (req, res) => {
    
    await AuthService.createUserToDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Register successfully! Please check your E-mail to verify.",
    });
  
});

exports.login = catchAsync(async (req, res) => {

    const result = await AuthService.login(req.body);
        return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Login successfully!",
        data: result
    });
  
});


exports.verifyEmail = catchAsync(async (req, res) => {
    const data = await AuthService.verifyEmail(req.body)
    return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Email Verified Successfully",
        data: data
    });
});

exports.forgotPassword = catchAsync(async (req, res) => {
    await AuthService.forgotPassword(req.body)
    return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Send OTP Successfully",
    });
});

exports.resetPassword = catchAsync(async (req, res) => {
    const user = req.user;
    await AuthService.resetPassword(user, req.body)
    return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password Updated Successfully"
    })
});

exports.changePassword = catchAsync(async (req, res) => {
    await AuthService.changePassword(req.body)
    return sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Password Changed Successfully"
    });
});

exports.updateProfile = catchAsync(async (req, res) => {
    const user = req.user;

    let profileImage="";
    if (req.files && "profileImage" in req.files && req.files.profileImage[0]) {
        profileImage = `/images/${req.files.profileImage[0].filename}`;
      }

    const data = {
        ...req.body,
        profileImage
    };

    const result = await AuthService.updateProfile(user, data)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Profile Updated Successfully",
        data: result
    });
});

exports.getProfileFromDB = catchAsync(async (req, res) => {

    const user = await AuthService.getProfileFromDB(req.user)
    return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Retrieve Data",
        user: user
    });
});

exports.deleteProfileFromDB = catchAsync(async (req, res) => {
    const id = req.user._id;
    await AuthService.deleteProfileFromDB(id)

    return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Delete User"
    });
});