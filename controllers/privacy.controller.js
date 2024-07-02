const PrivacyModel = require("../models/privacy.model");
const sendResponse = require("../shared/sendResponse");
const httpStatus = require("http-status");
const ApiError = require("../errors/ApiError");
const catchAsync = require("../shared/catchAsync");

exports.addPrivacy = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;
  let result;
  if (name && description) {
    result = await PrivacyModel.create({
      name: name,
      description: description,
    });
  }
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Created Privacy And Policy",
    data: result,
  });
});

exports.getPrivacy = catchAsync(async (req, res, next) => {
  const privacy = await PrivacyModel.findOne().sort({ createdAt: -1 });
  if (!privacy) {
    throw new ApiError(404, "No Data Found");
  }
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Data retrive",
    data: privacy,
  });
});

exports.updatePrivacy = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const privacy = await PrivacyModel.findById(id);
  if (!privacy) {
    throw new ApiError(404, "No Data Found");
  }

  privacy.name = name ? name : privacy.name;
  privacy.description = description ? description : privacy.description;
  await privacy.save();
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Privacy Updated Successfully",
  });
});
