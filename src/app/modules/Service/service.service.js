const { StatusCodes } = require("http-status-codes");
const ApiError = require("../../../errors/ApiError");
const Service = require("./service.model");
const { default: mongoose } = require("mongoose");

exports.createService=async(payload)=>{
    const result = await Service.create(payload);
    if(!result){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed To create")
    }
    return result;
};

exports.getServiceByCategoryFromDB=async(category)=>{
    const result = await Service.find({category: category}).populate("user")
    return result;
};

exports.deleteServiceFromDB=async(id)=>{
    const result = await Service.findById(id);
    if(!result){
        throw new ApiError(StatusCodes.NOT_FOUND, "No Service Found");
    }
    await Service.findByIdAndDelete({_id: id});
    return;
};

exports.updateServiceFromDB=async(id, user, payload)=>{
    const isValidUser = await Service.findOne({user: new mongoose.Types.ObjectId(user?._id)})
    if(!isValidUser){
        throw new ApiError(StatusCodes.NOT_FOUND, "Your Are Not authorized to change this service")
    }
    const isExitsService = await Service.findById(id);
    if(!isExitsService){    
        throw new ApiError(StatusCodes.NOT_FOUND, "No Service Found");
    }

    const service = await Service.findByIdAndUpdate({_id: id}, payload, {new: true})
    return service;
};