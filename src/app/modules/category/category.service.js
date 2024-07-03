const {StatusCodes} = require("http-status-codes");
const ApiError = require("../../../errors/ApiError");
const unlinkFile= require("../../../util/unlinkFile");
const Category = require("./category.model");

exports.createCategory= async(payload)=>{
    const category = await Category.create(payload);
    if(!category){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Field to create category");
    }
    return;
}

exports.deleteCategory= async(id)=>{
    //delete from folder
    const isCategoryExist = await Category.findById({_id: id});
    console.log("image", isCategoryExist?.image)
    unlinkFile(isCategoryExist?.image);

    //delete from database
    await Category.findByIdAndDelete(id);
    return;
}

exports.getCategory= async(id)=>{
    const category = await Category.find({});
    return category;
}

exports.updateCategory= async(id, payload)=>{
    
    //delete from folder
    const isCategoryExist = await Category.findById({_id: id});
    if(payload.image){
        unlinkFile(isCategoryExist?.image);
    }

    await Category.findByIdAndUpdate({_id: id}, payload, {new: true});
    return;
}