const ServicerService = require("./service.service");
const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const { StatusCodes } = require("http-status-codes");


exports.createService=catchAsync(async(req, res)=>{
    const payload = {
        user: req.user._id,
        ...req.body
    }
    const result = await ServicerService.createService(payload);
    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Service Created Successfully",
        data: result
    })
})

exports.getServiceByCategoryFromDB=catchAsync(async(req, res)=>{
    const category=req.params.category;
    const result = await ServicerService.getServiceByCategoryFromDB(category);
    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Service Retrieve Successfully",
        data: result
    })
})

exports.deleteServiceFromDB=catchAsync(async(req, res)=>{
    const id = req.params.id;
    const result = await ServicerService.deleteServiceFromDB(id);
    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Service Delete Successfully",
        data: result
    })
})


exports.updateServiceFromDB=catchAsync(async(req, res)=>{
    const user = req.user;
    const id = req.params.id;
    const payload = req.body;
    const result = await ServicerService.updateServiceFromDB(id, user, payload);
    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Service Updated Successfully",
        data: result
    })
})

exports.serviceListFromDB=catchAsync(async(req, res)=>{
    const user = req.user;
    const category = req.params.category;
    const result = await ServicerService.serviceListFromDB(category, user);
    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Service List Successfully",
        data: result
    })
})

exports.categoryServiceFromDB=catchAsync(async(req, res)=>{
    const category = req.params.category;
    const {id} = req.query;

    const result = await ServicerService.categoryServiceFromDB(category, id);
    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Service List Successfully",
        data: result
    })
})