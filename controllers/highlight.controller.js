const httpStatus = require("http-status");
const sendResponse = require("../shared/sendResponse");
const Highlight = require("../models/highlight.model");
const ApiError = require("../errors/ApiError");
const fs = require("fs");
const path = require("path");
const catchAsync = require("../shared/catchAsync");

exports.createHighlightToDB = catchAsync(async (req, res, next) => {
  let imageFile;
  if (req.files && req.files.image && req.files.image.length > 0) {
    imageFile = `/media/${req.files.image[0].filename}`;
  }
  const result = await Highlight.create({ ...req.body, image: imageFile });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Highlight created successfully",
    data: result,
  });
});

exports.getHighlightFromDB = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const result = await Highlight.find({ artist: id }).sort({
    createdAt: -1,
  });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Highlight retrieve successfully",
    data: result,
  });
});

exports.updateHighlightToDB = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const isExist = await Highlight.findById(id);

  if (!isExist) {
    throw new ApiError(404, "Data not found");
  }

  const fileName = isExist?.image?.split("/").pop();
  const filePath = path.join(__dirname, "..", "uploads", "media", fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  let imageFile;
  if (req.files.image && req.files.image.length > 0) {
    imageFile = `/media/${req.files.image[0].filename}`;
  }

  const payload = { ...req.body, image: imageFile };
  const result = await Highlight.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Highlight updated successfully",
    data: result,
  });
});

exports.deleteHighlightFromDB = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const result = await Highlight.findByIdAndDelete(id);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Highlight deleted successfully",
    data: result,
  });
});
