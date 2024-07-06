const AdminService = require("./admin.service");
const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const { StatusCodes } = require("http-status-codes");

exports.makeAdmin=catchAsync(async(req, res)=>{
    const payload = {
        ...req.body,
        role: "ADMIN",
        verified: true
    }
    await AdminService.makeAdmin(payload);
    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Admin Created Successfully"
    })
});

exports.adminLogin=catchAsync(async(req, res)=>{
    const token = await AdminService.adminLogin(req.body);
    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Logged In Successfully",
        data: {token}
    })
})

exports.getAdmin=catchAsync(async(req, res)=>{

    const result = await AdminService.getAdmin();
    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Admin Created Successfully",
        data: result
    })
})

exports.deleteAdmin=catchAsync(async(req, res)=>{
    const id = req.params.id;
    const result = await AdminService.deleteAdmin(id);
    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Admin Created Successfully",
        data: result
    })
})

exports.forgotPassword = catchAsync(async (req, res) => {
    await AdminService.forgotPassword(req.body)
    return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Send OTP Successfully",
    });
});

exports.verifyEmail = catchAsync(async (req, res) => {
    await AdminService.verifyEmail(req.body)
    return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Email Verified Successfully",
    });
});


exports.resetPassword = catchAsync(async (req, res) => {
    await AdminService.resetPassword(req.body)
    return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password Updated Successfully"
    });
});

exports.changePassword = catchAsync(async (req, res) => {
    await AdminService.resetPassword(req.user, req.body)
    return sendResponse(res, {
        statusCode: httpStatus.OK,
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

    const result = await AdminService.updateProfile(user, data)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Profile Updated Successfully",
        data: result
    });
});

exports.getProfileFromDB = catchAsync(async (req, res) => {

    const user = await AdminService.getProfileFromDB(req.user)
    return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Retrieve Data",
        user: user
    });
});