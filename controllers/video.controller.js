const Gig = require("../models/gig.model");
const User = require("../models/user.model");
const Video = require("../models/video.model");
const sendResponse = require("../shared/sendResponse");
const ApiError = require("../errors/ApiError");
const httpStatus = require("http-status");
const Notification = require("../models/notification.model");
const catchAsync = require("../shared/catchAsync");

exports.getAllVideo = catchAsync(async (req, res) => {
  const result = await Video.find({})
    .sort({ createdAt: -1 })
    .populate({ path: "artist", select: "firstName lastName image location" })
    .lean();

  const modifiedResult = result.map((video) => {
    return {
      ...video,
      comments: video.comments.length,
    };
  });

  // Sending response for video metadata
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All video retrieved successfully",
    data: modifiedResult,
  });

  // Streaming video data using fs.createReadStream
  result.forEach(async (vd) => {
    const video = vd.video;
    if (video && video.path) {
      const videoStream = fs.createReadStream(video.path);
      videoStream.on("open", () => {
        videoStream.pipe(res);
      });
      videoStream.on("error", (err) => {
        console.error("Error reading video file:", err);
        res.status(500).end("Internal Server Error");
      });
    }
  });
});

exports.getSingleVideo = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await Video.findById(id, { comments: 0 })
    .sort({ createdAt: -1 })
    .populate({ path: "artist", select: "firstName lastName image location" });

  // Sending response for video metadata
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single video retrieved successfully",
    data: result,
  });

  // Streaming video data using fs.createReadStream
  if (result && result.video.path) {
    const videoStream = fs.createReadStream(video.path);
    videoStream.on("open", () => {
      videoStream.pipe(res);
    });
    videoStream.on("error", (err) => {
      console.error("Error reading video file:", err);
      res.status(500).end("Internal Server Error");
    });
  }
});

exports.createComment = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { userId, comment } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(204, "No User Found");
  }

  //video find
  const video = await Video.findById(id);
  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  const updateVideo = await Video.findOneAndUpdate(
    { _id: id },
    { $push: { comments: { user: userId, comment } } },
    { new: true }
  );
  if (!updateVideo) {
    throw new ApiError(400, "Failed to post comment");
  }

  const videoOwner = await User.findById(video.artist);

  const notificationMessage = `${user.firstName} is comment on your video ${comment}`;
  //save to notification model
  const notification = await Notification.create({
    userInfo: { name: user.firstName, image: user.image, color: user.color },
    message: notificationMessage,
    role: videoOwner.role,
    user: videoOwner._id,
    type: "comment",
  });

  //socket notification
  io.emit(`notification::${videoOwner._id}`, notification);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment post successfully",
    data: updateVideo,
  });
});

exports.getVideoComments = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const video = await Video.findById(id)
    .populate({ path: "comments.user", select: "firstName lastName image" })
    .select("comments");
  if (!video) {
    throw new ApiError(httpStatus.OK, "Video doesn't exist!");
  }

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment retrieved successfully",
    data: video,
  });
});

exports.createWishList = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(204, "User not found");
  }

  const video = await Video.findById(id);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const index = video.wishList.findIndex(
    (wish) => wish.user.toString() === req.user._id
  );

  if (index === -1) {
    video.wishList.push({ user: req.user._id });
    await video.save();

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User added to wishlist",
      data: video,
    });
  } else {
    video.wishList.splice(index, 1);
    await video.save();

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User removed from wishlist",
      data: video,
    });
  }
});

exports.getWishListByUserId = catchAsync(async (req, res) => {
  const id = req.user._id;
  const result = await Video.find({ "wishList.user": id })
    .sort({
      createdAt: -1,
    })
    .select("gig video")
    .populate("gig");

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wishlist retrieve successfully",
    data: result,
  });
});
