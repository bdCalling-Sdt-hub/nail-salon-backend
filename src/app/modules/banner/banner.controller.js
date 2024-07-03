const  BannerService = require("./banner.server");
const sendResponse = require("../../../shared/sendResponse");
const catchAsync = require("../../../shared/catchAsync");
const {StatusCodes} = require("http-status-codes");


exports.createBanner = catchAsync(async (req, res) => {
    const bannerData = req.body;
    let bannerImage = "";
    if (req.files && "bannerImage" in req.files && req.files.bannerImage[0]) {
        bannerImage = `/images/${req.files.bannerImage[0].filename}`;
    }
    
    const data = {
        ...bannerData,
        bannerImage,
    };
  
    const result = await BannerService.createBannerToDB(data);
  
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Banner crated successfully",
        data: result,
    });
});
  
exports.getAllBanner = catchAsync(async (req, res) => {
    const result = await BannerService.getAllBannerFromDB();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Banner retrieve successfully",
        data: result,
    });
});
  
exports.updateBanner = catchAsync(async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;
    let bannerImage;
    if (req.files && "bannerImage" in req.files && req.files.bannerImage[0]) {
      bannerImage = `/images/${req.files.bannerImage[0].filename}`;
    }
    const data = {
      ...updateData,
      bannerImage,
    };
    const result = await BannerService.updateBannerToDB(id, data);
  
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Banner updated successfully",
        data: result,
    });
});
  
exports.deleteBanner = catchAsync(async (req, res) => {
    const id = req.params.id;
    const result = await BannerService.deleteBannerToDB(id);
  
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Banner delete successfully",
        data: result,
    });
});