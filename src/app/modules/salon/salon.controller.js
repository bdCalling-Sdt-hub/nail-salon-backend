const sendResponse = require("../../../shared/sendResponse");
const httpStatus = require("http-status");
const catchAsync = require("../../../shared/catchAsync");
const SalonService = require("./salon.service");

exports.updateSalon=catchAsync(async(req, res)=>{

    let gallery;
    if (req.files && "gallery" in req.files && req.files.gallery[0]) {
        gallery = `/images/${req.files.gallery[0].filename}`;
    }
    
    const data = {
        ...req.body,
        gallery,
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