const FAQ = require("../models/faq.model");
const ApiError = require("../errors/ApiError");
const sendResponse = require("../shared/sendResponse");
const httpStatus = require("http-status");
const catchAsync = require("../shared/catchAsync");

exports.createFAQToDB = catchAsync(async (req, res, next) => {
  const payload = req.body;
  const isExist = await FAQ.findOne({ title: payload.title });
  if (isExist) {
    throw new ApiError(409, "This Title Already Taken");
  }

  const faq = await FAQ.create(payload);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "FAQ created successfully",
    data: faq,
  });
});

exports.getFAQ = catchAsync(async (req, res, next) => {
  const faqs = await FAQ.find({});
  if (!faqs) {
    throw new ApiError(404, "No Data Found");
  }

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Data Retrive Successfully",
    data: faqs,
  });
});
