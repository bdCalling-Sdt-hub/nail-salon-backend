const {StatusCodes} = require("http-status-codes");
const ApiError = require("../../../errors/ApiError");
const Wishlist = require("./wishlist.model");
const Service = require("../Service/service.model")

exports.addToWishlistToDB = async (user, payload) => {
    const isExistService = await Service.findById(payload.service);
    if (!isExistService) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Service doesn't exist");
    }

    //wishlist
    let message;
    const serviceId = await Wishlist.findOne({
        user: user._id,
        service: payload.service,
    });

    if (serviceId) {
        await Wishlist.findOneAndDelete({
            user: user._id,
            product: payload.product,
        });
        message = "Remove from wishlist";
        isExistService.save();
    } else {
        const data = {
            user: user.id,
            product: payload.product,
        };
        await Wishlist.create(data);
        message = "Add to wishlist";
        isExistService.save();
    }
    return message;
};
  
exports.getProductsFromWishlistDB = async (user, category) => {
    const result = await Wishlist.find({ user: user._id }, {category: category});
    return result;
};