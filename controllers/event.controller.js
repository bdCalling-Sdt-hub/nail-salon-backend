const Event = require("../models/events.model");
const ApiError = require("../errors/ApiError");
const sendResponse = require("../shared/sendResponse");
const httpStatus = require("http-status");
const fs = require("fs");
const path = require("path");
const catchAsync = require("../shared/catchAsync");

exports.createEvent = catchAsync(async (req, res, next) => {
  const { name, colors } = req.body;

  let imageFileName = "";
  if (req.files && req.files.image && req.files.image[0]) {
    imageFileName = `/media/${req.files.image[0].filename}`;
  }

  const isExist = await Event.findOne({ name: name });

  if (isExist) {
    const fileName = imageFileName.split("/").pop();
    const filePath = path.join(__dirname, "..", "uploads", "media", fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    throw new ApiError(204, "Event name already taken");
  }

  const result = await Event.create({
    name: name,
    colors: colors,
    image: imageFileName,
  });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Banner Added Successfully",
    data: result,
  });
});

exports.getEvent = catchAsync(async (req, res, next) => {
  const events = await Event.find({});
  if (!events) {
    throw new ApiError(404, "No Events Found");
  }

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Events Data Retrive",
    data: events,
  });
});

exports.updateEvent = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, colors, image } = req.body;
  const event = await Event.findById(id);
  if (!event) {
    throw new ApiError(404, "No Event found by this ID");
  }

  let imageFileName = "";
  if (req.files && req.files.image && req.files.image[0]) {
    imageFileName = `/media/${req.files.image[0].filename}`;
  }

  if (imageFileName !== "") {
    const fileName = event?.image?.split("/").pop();
    const filePath = path.join(__dirname, "..", "uploads", "media", fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  (event.name = name ? name : event.name),
    (event.image = imageFileName ? imageFileName : image),
    (event.colors = colors ? colors : event.colors),
    await event.save();

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event Updated Successfully",
  });
});
