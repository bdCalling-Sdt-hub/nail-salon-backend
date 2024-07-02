const httpStatus = require("http-status");
const ApiError = require("../errors/ApiError");
const Gig = require("../models/gig.model");
const sendResponse = require("../shared/sendResponse");
const pick = require("../shared/pick");
const paginationCalculate = require("../helper/paginationHelper");
const Video = require("../models/video.model");
const User = require("../models/user.model");
const path = require("path");
const fs = require("fs");
const catchAsync = require("../shared/catchAsync");

//create gig
exports.createGigToDB = catchAsync(async (req, res, next) => {
  const user = req.user;
  const isExistUser = await User.findById(user._id);
  if (!isExistUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Artist doesn't exist");
  }

  //check have account information
  if (!isExistUser.accountInformation.status) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Please provide your bank information before adding a gig."
    );
  }

  const basicPackage = {
    serviceDescription: req.body.basicDes,
    price: req.body.basicPrice,
    totalService: req.body.basicTotalService,
  };
  const standardPackage = {
    serviceDescription: req.body.standardDes,
    price: req.body.standardPrice,
    totalService: req.body.standardTotalService,
  };
  const premiumPackage = {
    serviceDescription: req.body.premiumDes,
    price: req.body.premiumPrice,
    totalService: req.body.premiumTotalService,
  };

  const value = {
    ...req.body,
    thumbnail: `/media/${req.files.thumbnail[0].filename}`,
    basicPackage,
    standardPackage,
    premiumPackage,
    artist: user._id,
  };

  let createGig;
  if (value.thumbnail) {
    createGig = await Gig.create(value);
  }
  if (!createGig) {
    throw new ApiError(400, "Failed to created gig");
  }

  if (createGig) {
    const videoData = {
      video: `/media/${req.files.media[0].filename}`,
      location: createGig.location,
      videoDescription: createGig.about,
      price: createGig.basicPackage?.price,
      gig: createGig._id,
      artist: user._id,
    };

    const createVideo = await Video.create(videoData);
    createGig.video = createVideo._id;
    await createGig.save();

    if (!createVideo) {
      await Gig.findByIdAndDelete(createGig._id);
      throw new ApiError(400, "Failed to created gig");
    }
  }

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gig created Successfully",
    data: createGig,
  });
});

//get all gig
exports.getAllGigFromDB = catchAsync(async (req, res, next) => {
  const { interest } = await User.findById(req.user._id);
  const paginationOptions = pick(req.query, ["limit", "page"]);
  const { priceMin, priceMax } = pick(req.query, ["priceMin", "priceMax"]);
  const filters = pick(req.query, ["searchTerm", "category", "location"]);
  const { limit, page, skip } = paginationCalculate(paginationOptions);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: ["contentName", "location"].map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });

    andConditions.push({
      searchTags: {
        $elemMatch: {
          $regex: searchTerm,
          $options: "i",
        },
      },
    });
  }

  if (
    Object.keys(filterData).length &&
    filterData.category !== undefined &&
    filterData.location !== undefined
  ) {
    andConditions.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  if (priceMin && priceMax) {
    andConditions.push({
      "basicPackage.price": {
        $gte: priceMin,
        $lte: priceMax,
      },
    });
  }

  if (interest) {
    andConditions.push({ category: { $in: interest } });
  }

  const whereConditions =
    andConditions.length > 0
      ? {
          $and: andConditions,
        }
      : {};

  const result = await Gig.find(whereConditions)
    .sort()
    .skip(skip)
    .limit(limit)
    .populate(["artist", "video"]);

  const total = await Gig.countDocuments(whereConditions);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All gig retrieved successfully",
    pagination: {
      page,
      limit,
      total,
    },
    data: result,
  });
});

//update git
exports.updateGigToDB = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let bodyData = {};

  // Parse JSON data if provided
  if (req.body.data) {
    try {
      bodyData = JSON.parse(req.body.data);
    } catch (error) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid JSON data");
    }
  }

  console.log(bodyData);

  const { basicPackage, standardPackage, premiumPackage, ...gigData } =
    bodyData;

  const isExistGig = await Gig.findById(id);
  if (!isExistGig) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Gig not found");
  }

  let thumbnail;
  if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
    thumbnail = `/media/${req.files.thumbnail[0].filename}`;
  }

  //unlink file
  if (thumbnail) {
    const fileName = isExistGig?.thumbnail?.split("/").pop();
    const filePath = path.join(__dirname, "..", "uploads", "media", fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  const updatedData = { ...gigData, thumbnail };

  //basic
  if (basicPackage && Object.keys(basicPackage).length > 0) {
    Object.keys(basicPackage).forEach((key) => {
      const basicPackageKey = `basicPackage.${key}`;
      updatedData[basicPackageKey] = basicPackage[key];
    });
  }

  //standard
  if (standardPackage && Object.keys(standardPackage).length > 0) {
    Object.keys(standardPackage).forEach((key) => {
      const standardPackageKey = `standardPackage.${key}`;
      updatedData[standardPackageKey] = standardPackage[key];
    });
  }

  //premium
  if (premiumPackage && Object.keys(premiumPackage).length > 0) {
    Object.keys(premiumPackage).forEach((key) => {
      const premiumPackageKey = `premiumPackage.${key}`;
      updatedData[premiumPackageKey] = premiumPackage[key];
    });
  }

  const result = await Gig.findOneAndUpdate({ _id: id }, updatedData, {
    new: true,
  });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gig Updated successfully",
    data: result,
  });
});

//find git by id
exports.findGigByArtistId = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const result = await Gig.find({ artist: id }).sort({ createdAt: -1 });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single Artist gig retrieved successfully",
    data: result,
  });
});

//add rating
exports.addRating = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log("gig id rating", id);
  const { ratings } = req.body;
  const gig = await Gig.findById(id).populate("artist");

  if (!gig) {
    throw new ApiError(404, "Gig not Found");
  }
  const count = parseInt(gig?.ratings.count) + 1;
  const newRating =
    (parseInt(ratings) * count +
      parseInt(gig?.ratings.rate) * parseInt(gig?.ratings.count)) /
    (count + parseInt(gig?.ratings.count));

  const result = await Gig.findOneAndUpdate(
    { _id: id },
    { $set: { "ratings.rate": newRating.toString(), "ratings.count": count } },
    { new: true }
  );

  const artist = await User.findById(result.artist);
  if (!artist) {
    throw new ApiError(404, "User not Found");
  }

  const artistCount = parseInt(artist?.ratings.count) + 1;
  const artistRating =
    (parseInt(ratings) * count +
      parseInt(artist?.ratings.rate) * parseInt(artist?.ratings.count)) /
    (count + parseInt(artist?.ratings.count));

  const newResult = await User.findOneAndUpdate(
    { _id: result?.artist },
    {
      $set: {
        "ratings.rate": artistRating.toString(),
        "ratings.count": artistCount,
      },
    },
    { new: true }
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Added Rating Successfully",
    data: newResult,
  });
});

//get event
exports.gigByEventName = catchAsync(async (req, res, next) => {
  const { event } = req.query;
  let gig;
  if (event) {
    gig = await Gig.find({ event: event }).populate("video");
  } else {
    gig = await Gig.find({}).sort({ createdAt: -1 });
  }

  if (!gig) {
    throw new ApiError(404, "Gig not Found");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrieve Gig Data Successfully",
    data: gig,
  });
});

//
