const ProductService = require("./product.service");
const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const { StatusCodes } = require("http-status-codes");


exports.createProduct=catchAsync(async(req, res)=>{
    
    let image = "";
    if (req.files && "image" in req.files && req.files.image[0]) {
        image = `/images/${req.files.image[0].filename}`;
    }
    
    const data = {
        ...req.body,
        salon: req.user._id,
        image,
    };

    const result = await ProductService.createProduct(data);
    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Product Created Successfully",
        data: result
    })
})

exports.getProductsFromDB=catchAsync(async(req, res)=>{

    const user=req.user;
    const result = await ProductService.getProductsFromDB(user);
    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Product Retrieve Successfully",
        data: result
    })
})

exports.deleteProductFromDB=catchAsync(async(req, res)=>{
    const id = req.params.id;
    const salon = req.user;
    const result = await ProductService.deleteProductFromDB(id, salon);
    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Product Delete Successfully",
        data: result
    })
})

exports.updateProductToDB=catchAsync(async(req, res)=>{
    const user = req.user;
    const id = req.params.id;

    let image = "";
    if (req.files && "image" in req.files && req.files.image[0]) {
        image = `/images/${req.files.image[0].filename}`;
    }
    
    const payload = {
        ...req.body,
        image,
    };

    const result = await ProductService.updateProductToDB(id, user, payload);
    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Product Updated Successfully",
        data: result
    })
})

exports.updateProductQuantityToDB=catchAsync(async(req, res)=>{
    const user = req.user;
    const id = req.params.id;
    const payload = req.body;

    const result = await ProductService.updateProductQuantityToDB(id, user, payload);
    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Product Quantity Updated Successfully",
        data: result
    })
})