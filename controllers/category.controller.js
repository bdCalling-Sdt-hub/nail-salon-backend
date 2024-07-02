const CategoryModel = require("../models/categorySchema");
const fs = require("fs");
const path = require("path");
const sendResponse = require("../shared/sendResponse");
const httpStatus = require("http-status");
const ApiError = require("../errors/ApiError");
const catchAsync = require("../shared/catchAsync");

// add category
exports.addCategory = catchAsync(async (req, res, next) => {
  const { name, colors } = req.body;

  let imageFileName = "";
  if (req.files && req.files.image && req.files.image[0]) {
    imageFileName = `/media/${req.files.image[0].filename}`;
  }

  const result = await CategoryModel.create({
    name: name,
    colors: colors,
    image: imageFileName,
  });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Created a new Category",
    data: result,
  });
});

// fetch category
exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await CategoryModel.find({}).sort({ createdAt: -1 });
  if (!category) {
    throw new ApiError(404, "No Category Found");
  }
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category Data retrive successfully",
    data: category,
  });
});

// get single category
exports.getSingleCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const category = await CategoryModel.findOne({ _id: id });
  if (!category) {
    throw new ApiError(404, "No Category Found");
  }
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get Single Category Retrive",
    data: category,
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const category = await CategoryModel.findOneAndDelete({ _id: id });
  if (!category) {
    throw new ApiError(404, "No Category Found");
  }
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category Delete Successfully",
  });
});

// update category
exports.updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const category = await CategoryModel.findOne({ _id: id });
  if (!category) {
    throw new ApiError(404, "No Category Found");
  }

  const { name, colors, image } = req.body;
  console.log(req.body);
  let imageFileName = "";
  if (req.files && req.files.image && req.files.image[0]) {
    imageFileName = `/media/${req.files.image[0].filename}`;
  }

  if (imageFileName) {
    const fileName = category?.image?.split("/").pop();
    const filePath = path.join(__dirname, "..", "uploads", "media", fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  (category.name = name ? name : category.name),
    (category.colors = colors ? colors : category.colors),
    (category.image = imageFileName ? imageFileName : image);
  const result = await category.save();
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category Updated Successfully",
    data: result,
  });
});
