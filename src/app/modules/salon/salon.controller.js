const sendResponse = require("../../../shared/sendResponse");
const httpStatus = require("http-status");
const catchAsync = require("../../../shared/catchAsync");
const SalonService = require("./salon.service");

exports.updateSalon=catchAsync(async(req, res)=>{

    let gallery;
    if (req.files && "gallery" in req.files && req.files.gallery[0]) {
        gallery = `/images/${req.files.gallery[0].filename}`;
    }

    let profileImage="";
    if (req.files && "profileImage" in req.files && req.files.profileImage[0]) {
        profileImage = `/images/${req.files.profileImage[0].filename}`;
    }
    
    const data = {
        ...req.body,
        gallery,
        profileImage
    };

    const salon = await SalonService.updateSalon(req.user, data);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Salon Updated Successfully",
        data: salon
    });
});

exports.getFeaturedSalon=catchAsync(async(req, res)=>{
    const salon = await SalonService.getFeaturedSalon();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Featured Salon Retrieved Successfully",
        data: salon
    });
});

exports.makeFeaturedSalon=catchAsync(async(req, res)=>{
    const salon = await SalonService.makeFeaturedSalon(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `${salon.featured ? "Make Featured Salon" : "Removed from Featured "}`,
        data: salon
    });
});

exports.salonListFromDB=catchAsync(async(req, res)=>{
    const salon = await SalonService.salonListFromDB(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Salon List Retrieved Successfully",
        data: salon
    });
});

exports.salonDetailsFromDB=catchAsync(async(req, res)=>{
    const salon = await SalonService.salonDetailsFromDB(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Salon Details Retrieved Successfully",
        data: salon
    });
});

exports.salonsFromDB=catchAsync(async(req, res)=>{
    const salon = await SalonService.salonsFromDB(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Salon List Retrieved Successfully",
        data: salon
    });
});