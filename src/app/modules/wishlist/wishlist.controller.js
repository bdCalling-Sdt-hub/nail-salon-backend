
const { StatusCodes } =require("http-status-codes");
const catchAsync =require("../../../shared/catchAsync");
const sendResponse =require("../../../shared/sendResponse");
const WishlistService =require("./wishlist.service");

const addToWishlist = catchAsync(async (req, res) => {
    const user = req.user;
    const productData = req.body;

    const result = await WishlistService.addToWishlistToDB(user, productData);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: result,
    });
});

const getProductsFromWishlist = catchAsync(async (req, res) => {
    const id = req.user._id;
    const category = req.query.category;
    const result = await WishlistService.getProductsFromWishlistDB(id, category);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Successfully retrieved wishlist products",
        data: result
    });
});

export const WishlistController = { addToWishlist, getProductsFromWishlist };