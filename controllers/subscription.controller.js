const httpStatus = require("http-status");
const Subscription = require("../models/subscriptionSchema");
const sendResponse = require("../shared/sendResponse");
const ApiError = require("../errors/ApiError");
const catchAsync = require("../shared/catchAsync");

// add slider image
exports.addSubscription = catchAsync(async (req, res, next) => {
  const {
    package_name,
    package_duration,
    package_price,
    gig_count,
    package_features,
  } = req.body;

  const result = await Subscription.create({
    package_name: package_name,
    package_duration: package_duration,
    package_price: parseInt(package_price),
    gig_count: parseInt(gig_count),
    package_features,
  });
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Created subcription Plan Successfully",
    data: result,
  });
});

// get all slider
exports.getSubscription = catchAsync(async (req, res, next) => {
  const subscription = await Subscription.find({});
  if (!subscription) {
    throw new ApiError(404, "No Subscription Found");
  }
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " subcription retrive Successfully",
    data: subscription,
  });
});

exports.getSingleSubscription = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const subscription = await Subscription.findById(id);
  if (!subscription) {
    throw new ApiError(404, "No Subscription Found");
  }
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " subcription retrive Successfully",
    data: subscription,
  });
});

// update single slider
exports.updateSubscription = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { package_name, package_duration, package_price, gig_count } = req.body;
  const result = await Subscription.findById(id);
  if (!result) {
    throw new ApiError(404, "No Subscription Found");
  }

  result.package_name = package_name ? package_name : result.package_name;
  result.package_duration = package_duration
    ? package_duration
    : result.package_duration;
  result.package_price = package_price ? package_price : result.package_price;
  result.gig_count = gig_count ? gig_count : result.gig_count;

  await result.save();
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscription Updated Successfully",
    data: result,
  });
});
