const {StatusCodes} = require("http-status-codes");
const catchAsync= require("../../../shared/catchAsync")
const sendResponse= require("../../../shared/sendResponse")
const CategoryService= require("./category.service");

exports.createCategory= catchAsync(async(req, res)=>{
    const {...categoryData} = req.body;
    let image = "";
    if (req.files && "image" in req.files && req.files.image[0]) {
        image = `/images/${req.files.image[0].filename}`;
    }

    const data = {
        ...categoryData,
        image,
    };
    const category = await CategoryService.createCategory(data);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Category Created Successfully",
        data: category
    })

});


exports.deleteCategory= catchAsync(async(req, res)=>{
    const id = req.params.id;
    
    await CategoryService.deleteCategory(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Category deleted Successfully"
    })
});

exports.updateCategory= catchAsync(async(req, res)=>{
    const id = req.params.id;
    const categoryData = {...req.body};
    let image;
    if (req.files && "image" in req.files && req.files.image[0]) {
        image = `/images/${req.files.image[0].filename}`;
    }
    
    const data = {
        ...categoryData,
        image,
    };
    const updatedCategory = await CategoryService.updateCategory(id, data);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Category updated Successfully",
        data: updatedCategory
    })
});

exports.getCategory= catchAsync(async(req, res)=>{
    const category = await CategoryService.getCategory();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Category retrieve Successfully",
        data: category
    })
});