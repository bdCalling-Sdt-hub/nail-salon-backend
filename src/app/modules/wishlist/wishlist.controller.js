
const { StatusCodes } =require("http-status-codes");
const catchAsync =require("../../../shared/catchAsync");
const sendResponse =require("../../../shared/sendResponse");
const WishlistService =require("./wishlist.service");

exports.addToWishlist = catchAsync(async (req, res) => {
    const user = req.user;
    const payload = req.params.id;

    const result= await WishlistService.addToWishlistToDB(user, payload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: result,
    });
});

exports.getWishlistFromDB = catchAsync(async (req, res) => {
    const user = req.user;
    const result = await WishlistService.getWishlistFromDB(user);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Successfully retrieved wishlist products",
        data: result
    });
});