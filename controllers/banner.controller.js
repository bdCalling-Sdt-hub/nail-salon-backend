const Banner = require("../models/bannerSchema"); // Corrected import statement
const fs = require("fs");
const path = require("path");
const sendResponse = require("../shared/sendResponse");
const ApiError = require("../errors/ApiError");
const httpStatus = require("http-status");
const catchAsync = require("../shared/catchAsync");

// add slider image
exports.addBanner = catchAsync(async (req, res, next) => {
  let imageFileName = "";
  if (req.files && req.files.image && req.files.image[0]) {
    imageFileName = `/media/${req.files.image[0].filename}`;
  }

  const result = await Banner.create({ banner: imageFileName });
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Banner Added Successfully",
    data: result,
  });
});

// get all slider
exports.getBanner = catchAsync(async (req, res, next) => {
  const slider = await Banner.find({});
  if (!slider) {
    throw new ApiError("No Data Found");
  }
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Banner Data Fetch Successfully",
    data: slider,
  });
});

// update single slider
exports.updateBanner = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await Banner.findOne({ _id: id });
  if (!result) {
    throw new ApiError(404, "No Data Found");
  }

  const fileName = result?.banner?.split("/").pop();
  const filePath = path.join(__dirname, "..", "uploads", "media", fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  let imageFileName = "";
  if (req.files && req.files.image && req.files.image[0]) {
    imageFileName = `/media/${req.files.image[0].filename}`;
  }

  result.slider = imageFileName;
  await result.save();
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Banner updated Successfully",
    data: result,
  });
});

// delete a single banner
exports.deleteBanner = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await Banner.findOne({ _id: id });
  if (!result) {
    throw new ApiError(400, "No Data Found");
  }

  const fileName = result?.banner?.split("/").pop();
  const filePath = path.join(__dirname, "..", "uploads", "media", fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    await Banner.findByIdAndDelete({ _id: id });
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Banner Deleted Successfully",
    });
  }
});
