const {StatusCodes} = require("http-status-codes");
const ApiError = require("../../../errors/ApiError");
const unlinkFile= require("../../../util/unlinkFile");
const Category = require("./category.model");

exports.createCategory= async(payload)=>{
    const category = await Category.create(payload);
    if(!category){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Field to create category");
    }
    return category;
}

exports.deleteCategory= async(id)=>{
    //delete from folder
    const isCategoryExist = await Category.findById({_id: id});
    if(isCategoryExist?.image){
        unlinkFile(isCategoryExist?.image);
    }

    //delete from database
    await Category.findByIdAndDelete(id);
    return;
}

exports.getCategory= async()=>{
    const category = await Category.find({});
    return category;
}

exports.updateCategory= async(id, payload)=>{
    
    const { image, ...othersPayload} = payload
    //delete from folder
    const isCategoryExist = await Category.findById(id);
    if(image){
        unlinkFile(isCategoryExist?.image);
        othersPayload.image=image
    }

    const result = await Category.findByIdAndUpdate({_id: id}, payload, {new: true});
    return result;
}