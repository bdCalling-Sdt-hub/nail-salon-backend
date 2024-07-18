const {StatusCodes} = require("http-status-codes");
const catchAsync= require("../../../shared/catchAsync")
const sendResponse= require("../../../shared/sendResponse")
const FaqService= require("./fag.service");

exports.createFaq = catchAsync(async (req, res) => {
    const { ...faqData } = req.body;
    const result = await FaqService.createFaqToDB(faqData);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Frequently ask question created successfully!",
        data: result,
    });
});
exports.getAllFaq = catchAsync(async (req, res) => {
    const result = await FaqService.getAllFaqToDB();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Frequently ask question retrieved successfully!",
        data: result,
    });
});
exports.updateFaq = catchAsync(async (req, res) => {
    const id = req.params.id;
    const { ...updateFaqData } = req.body;
    const result = await FaqService.updateFaqToDB(id, updateFaqData);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Frequently ask question updated successfully!",
        data: result,
    });
});

exports.deleteFaq = catchAsync(async (req, res) => {
    const id = req.params.id;
    const result = await FaqService.deleteFaqToDB(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Frequently ask question delete successfully!",
        data: result,
    });
});