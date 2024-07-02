const httpStatus = require("http-status");
const sendResponse = require("../shared/sendResponse");
const Order = require("../models/order.model");
const ApiError = require("../errors/ApiError");
const { cryptoToken, qrCodeGenerate } = require("../util/util");
const Token = require("../models/token.model");
const catchAsync = require("../shared/catchAsync");

exports.makeOrder = catchAsync(async (req, res) => {
  const user = req.user;
  const payload = {
    user: user._id,
    paymentStatus: "paid_to_admin",
    ...req.body,
  };

  console.log("order", payload);

  const createOrder = await Order.create(payload);
  if (!createOrder) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Failed to create order on database"
    );
  }

  const token = cryptoToken();
  // Save token to the database
  await Token.create({
    token: token,
    orderId: createOrder._id,
  });

  const qrCode = await qrCodeGenerate(token);

  //save to qrcode into DB
  await Order.findByIdAndUpdate({ _id: createOrder._id }, { qrCode });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order created successfully!",
    data: qrCode,
  });
});

exports.getDealList = catchAsync(async (req, res) => {
  const user = req.user;
  const query =
    user.role === "ARTIST" ? { artist: user._id } : { user: user._id };

  const result = await Order.find({
    $and: [
      query,
      { orderStatus: { $ne: "completed" } },
      { paymentStatus: { $ne: "transferred_to_artist" } },
    ],
  })
    .sort({ createdAt: -1 })
    .populate([
      {
        path: "user",
        select:
          "_id image firstName lastName color about profession location email mobileNumber",
      },
      {
        path: "artist",
        select:
          "_id image firstName lastName color about profession location email mobileNumber",
      },
    ]);

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Archive data not found!");
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Archive retrieve successfully!",
    data: result,
  });
});

exports.getSingleDeal = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await Order.findById(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Single Deal retrieve successfully!",
    data: result,
  });
});

exports.getArchiveList = catchAsync(async (req, res) => {
  const user = req.user;
  const query =
    user.role === "ARTIST" ? { artist: user._id } : { user: user._id };

  const result = await Order.find({
    $and: [
      query,
      { orderStatus: "completed" },
      { paymentStatus: "transferred_to_artist" },
    ],
  })
    .sort({ createdAt: -1 })
    .populate([
      {
        path: "user",
        select:
          "_id image firstName lastName color about profession location email mobileNumber",
      },
      {
        path: "artist",
        select:
          "_id image firstName lastName color about profession location email mobileNumber",
      },
    ]);
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Archive data not found!");
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Archive retrieve successfully!",
    data: result,
  });
});
