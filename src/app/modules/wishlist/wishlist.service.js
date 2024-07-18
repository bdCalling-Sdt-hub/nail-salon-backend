const {StatusCodes} = require("http-status-codes");
const ApiError = require("../../../errors/ApiError");
const Wishlist = require("./wishlist.model");
const User = require("../user/user.model")

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
    const result = await Wishlist.find({ user: user._id });
    return result;
};