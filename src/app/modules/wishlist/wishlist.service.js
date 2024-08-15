const {StatusCodes} = require("http-status-codes");
const ApiError = require("../../../errors/ApiError");
const Wishlist = require("./wishlist.model");
const User = require("../user/user.model");
const mongoose = require("mongoose");

exports.addToWishlistToDB = async (user, payload) => {
    const isExistUser = await User.findById(user?._id);
    if (!isExistUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist");
    }

    //wishlist
    let message;
    const isExistWish = await Wishlist.findOne({
        user: user._id,
        salon: payload,
    });

    if (isExistWish) {
        await Wishlist.findOneAndDelete({
            user: user._id,
            salon: payload,
        });
        message = "Remove from wishlist";
    } else {
        const data = {
            user: user._id,
            salon: payload,
        };
        await Wishlist.create(data);
        message = "Add to wishlist";
    }
    return message;
};
  
exports.getWishlistFromDB = async (user) => {
    const userId = new mongoose.Types.ObjectId(user._id);

    const result = await Wishlist.find({ user: userId })
        .populate({
            path: 'salon',
            select: "_id name profileImage location rating totalRating"
        })
        .select("_id salon");

    const salonIds = result.map((item) => item.salon._id.toString());

    // Add featured property to each salon if it matches a salon in the wishlist
    const salons = result.map((item) => {
        const salon = item.salon.toObject();
        const isFeatured = salonIds.includes(salon._id.toString());
        return { ...salon, wish: isFeatured };
    });

    return salons;
};