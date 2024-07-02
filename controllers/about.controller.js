const httpStatus = require("http-status");
const AboutModel = require("../models/about.model");
const sendResponse = require("../shared/sendResponse");
const ApiError = require("../errors/ApiError");
const catchAsync = require("../shared/catchAsync");

exports.addAboutUs = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;
  let result;
  if (name && description) {
    result = await AboutModel.create({
      name: name,
      description: description,
    });
  }
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "About Us Added Successfully",
    data: result,
  });
});

exports.getAboutUs = catchAsync(async (req, res, next) => {
  const about = await AboutModel.findOne().sort({ createdAt: -1 });
  if (!about) {
    throw new ApiError(404, "No About Found");
  }
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "About Us data retrive successfully",
    data: about,
  });
});

exports.updateAboutUs = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const about = await AboutModel.findById(id);

  if (!about) {
    throw new ApiError(404, "No About Found");
  }

  const { name, description } = req.body;
  about.name = name ? name : about.name;
  about.description = description ? description : about.description;
  const result = await about.save();
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "About Us Updated Successfully",
    data: result,
  });
});
