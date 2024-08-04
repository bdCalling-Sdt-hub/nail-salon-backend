const ReviewService = require("./review.service");
const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const { StatusCodes } = require("http-status-codes");

exports.createReview=catchAsync(async(req, res)=>{
    const payload = {
        user: req.user._id,
        ...req.body
    }
    await ReviewService.createReview(payload);
    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Review Created Successfully"
    })
})

exports.getReview=catchAsync(async(req, res)=>{
    const result = await ReviewService.getReview(req.params.id);
    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Review Retrieved Successfully",
        data: result
    })
})