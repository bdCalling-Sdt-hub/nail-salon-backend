const bcrypt = require("bcrypt");
const sendResponse = require("../../../shared/sendResponse");
const httpStatus = require("http-status");
const catchAsync = require("../../../shared/catchAsync");
// const UserService = require("../user/user.server");
const AuthService = require("./auth.service");
const generateOTP = require("../../../util/generateOTP");


exports.register = catchAsync(async (req, res) => {
    
    await AuthService.createUserToDB(req.body);
    return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Register successfully! Please check your E-mail to verify.",
    });
  
});

exports.login = catchAsync(async (req, res) => {
    const payload = req.body;
    const { token }= await AuthService.login(payload);
        return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Login successfully!",
        data: token
    });
  
});


exports.verifyEmail = catchAsync(async (req, res) => {
    await AuthService.verifyEmail(req.body)
    return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Email Verified Successfully",
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
    await AuthService.resetPassword(req.body)
    return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password Updated Successfully"
    });
});

exports.changePassword = catchAsync(async (req, res) => {
    await AuthService.resetPassword(req.body)
    return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password Changed Successfully"
    });
});

exports.updateProfile = catchAsync(async (req, res) => {
    const user = req.user;
    const updateData = req.body;

    let imageFileName;
    if (req.files && req.files.image && req.files.image[0]) {
        imageFileName = `/media/${req.files.image[0].filename}`;
    }

    const fileName = isExistUser?.image?.split("/").pop();
    const filePath = path.join(__dirname, "..", "uploads", "media", fileName);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    const data = {
        ...updateData,
        imageFileName,
    };

    await AuthService.updateProfile(user, data)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Profile Updated Successfully",
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
    const user = await AuthService.getProfileFromDB(id)

    return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Retrieve Data",
        user: user
    });
});