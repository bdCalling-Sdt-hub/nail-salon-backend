const { StatusCodes } = require("http-status-codes");
const ApiError = require("../../../errors/ApiError");
const Product = require("./product.model");
const unlinkFile = require("../../../util/unlinkFile");

exports.createProduct=async(payload)=>{
    const result = await Product.create(payload);
    if(!result){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed To create")
    }
    return result;
};

exports.getProductsFromDB=async(user, stock)=>{
    const query = {
        salon: user?._id,
    };

    // Check if there is a query parameter for quantity
    if(stock === "stockOut"){
        query.quantity = 0;
    }

    
    const result = await Product.find(query);
    return result;
};

exports.getProductDetailsFromDB=async(id, user)=>{

    const isExitsProduct = await Product.findById(id);
    if(!isExitsProduct){
        throw new ApiError(StatusCodes.NOT_FOUND, "No Product Found");
    }

    if(isExitsProduct.salon.toString() !== user?._id.toString()){
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Your Are not Authorized to Delete this Product");
    }
    return isExitsProduct;
};

exports.deleteProductFromDB=async(id, user)=>{

    const isExitsProduct = await Product.findById(id)


    if(isExitsProduct.salon.toString() !== user?._id.toString()){
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Your Are not Authorized to Delete this Product");
    }

    const result = await Product.findByIdAndDelete(id);
    if(!result){
        throw new ApiError(StatusCodes.NOT_FOUND, "No Product Found");
    }

    return result;
};

exports.updateProductToDB=async(id, user, payload)=>{
    const { image, ...othersPayload} = payload;

    const isExitsProduct = await Product.findById(id);
    if(!isExitsProduct){    
        throw new ApiError(StatusCodes.NOT_FOUND, "No Product Found");
    }

    if(isExitsProduct.salon.toString() !== user?._id.toString()){
        throw new ApiError(StatusCodes.NOT_FOUND, "Your Are Not authorized to change this Product")
    }

    if(image){
        unlinkFile(isExitsProduct?.image);
        othersPayload.image=image
    }
    
    const product = await Product.findByIdAndUpdate({_id: id}, othersPayload, {new: true})
    return product;
};

exports.updateProductQuantityToDB=async(id, user, payload)=>{

    const isExitsProduct = await Product.findById(id);
    if(!isExitsProduct){    
        throw new ApiError(StatusCodes.NOT_FOUND, "No Product Found");
    }

    if(isExitsProduct.salon.toString() !== user?._id.toString()){
        throw new ApiError(StatusCodes.NOT_FOUND, "Your Are Not authorized to change this Product")
    }

    const product = await Product.findByIdAndUpdate({_id: id}, payload, {new: true})
    return product;
};