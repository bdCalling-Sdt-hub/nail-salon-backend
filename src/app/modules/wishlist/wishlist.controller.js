
const { StatusCodes } =require("http-status-codes");
const catchAsync =require("../../../shared/catchAsync");
const sendResponse =require("../../../shared/sendResponse");
const WishlistService =require("./wishlist.service");

exports.addToWishlist = catchAsync(async (req, res) => {
    const user = req.user;
    const payload = req.params.id;

    await WishlistService.addToWishlistToDB(user, payload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: result,
    });
});

exports.getWishlistFromDB = catchAsync(async (req, res) => {
    const id = req.user._id;

    const result = await WishlistService.getWishlistFromDB(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Successfully retrieved wishlist products",
        data: result
    });
});