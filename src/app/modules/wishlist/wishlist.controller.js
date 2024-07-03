
const { StatusCodes } =require("http-status-codes");
const catchAsync =require("../../../shared/catchAsync");
const sendResponse =require("../../../shared/sendResponse");
const WishlistService =require("./wishlist.service");

exports.addToWishlist = catchAsync(async (req, res) => {
    const user = req.user;
    const serviceData = req.body;

    const result = await WishlistService.addToWishlistToDB(user, serviceData);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: result,
    });
});

exports.getServicesFromWishlist = catchAsync(async (req, res) => {
    const id = req.user._id;
    const category = req.query.category;
    const result = await WishlistService.getServicesFromWishlistDB(id, category);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Successfully retrieved wishlist products",
        data: result
    });
});