const {StatusCodes} = require("http-status-codes");
const ApiError = require("../../../errors/ApiError");
const unlinkFile= require("../../../util/unlinkFile");
const Banner = require("./banner.model");

exports.createBannerToDB = async (payload) => {
  const {name} = payload;
  const isExitsName = await Banner.findOne(name);

  if(isExitsName){
    throw new ApiError(StatusCodes.BAD_REQUEST, "This Name Already Taken")
  }
  const createBanner = await Banner.create(payload);
  if (!createBanner) {
    throw new ApiError(StatusCodes.OK, "Failed to created banner");
  }

  return createBanner;
};

exports.getAllBannerFromDB = async ()=> {
  return await Banner.find({});
};

exports.updateBannerToDB = async (id, payload) => {
  const isBannerExist = await Banner.findById(id);

  if (payload.bannerImage) {
    unlinkFile(isBannerExist?.bannerImage);
  }

  return await Banner.findOneAndUpdate({ _id: id }, payload, {new: true});
};

exports.deleteBannerToDB = async (id) => {

  //delete from folder
  const isBannerExist = await Banner.findById({_id: id});
  console.log("image", isBannerExist?.bannerImage)
  unlinkFile(isBannerExist?.bannerImage);

  //delete from database
  await Banner.findByIdAndDelete(id);
  return; 
};
