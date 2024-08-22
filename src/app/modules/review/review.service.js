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

        // checking the rating is valid or not;
        const rating = Number(payload.rating);
        if (rating < 1 || rating > 5) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid rating value");
        }
        

        // Update artist's rating and total ratings count
        const totalRating = isSalonExist.totalRating + 1;

        let newRating;
        if (isSalonExist.rating === null || isSalonExist.rating === 0) {
            // If no previous ratings, the new rating is the first one
            newRating = rating;
        } else {
            // Calculate the new rating based on previous ratings
            newRating = ((isSalonExist.rating * isSalonExist.totalRating) + rating) / totalRating;
        }
    
        isSalonExist.totalRating = totalRating;
        isSalonExist.rating = Number(newRating).toFixed(2);
    
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