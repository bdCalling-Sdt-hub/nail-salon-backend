const { StatusCodes } = require("http-status-codes");
const ApiError = require("../../../errors/ApiError");
const Review = require("./review.model");
const { default: mongoose } = require("mongoose");
const User = require("../user/user.model");

exports.createReview=async(payload)=>{
    const isSalonExist = await User.findOne({_id: new mongoose.Types.ObjectId(payload.salon)});
    if(!isSalonExist){
        throw new ApiError(StatusCodes.NOT_FOUND, "No Salon Found");
    }

    if (payload.rating) {
        // Increase the total count of ratings
        isSalonExist.totalRating = isSalonExist.totalRating + 1;
        
    
        // Add the new rating to the sum of all ratings
        isSalonExist.rating = Number(isSalonExist.rating) + Number(payload.rating);

        // Calculate the new average rating
        isSalonExist.rating = isSalonExist.rating / isSalonExist.totalRating;
    
        // Save the updated salon document
        await isSalonExist.save();
    }

    const result = await Review.create(payload);
    if(!result){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed To create Review")
    }
    return payload;
};

exports.getReview=async(id)=>{
    const isSalonExist = await Review.find({salon: new mongoose.Types.ObjectId(id)});
    if(!isSalonExist){
        throw new ApiError(StatusCodes.NOT_FOUND, "No Salon Found");
    }

    return isSalonExist;
};