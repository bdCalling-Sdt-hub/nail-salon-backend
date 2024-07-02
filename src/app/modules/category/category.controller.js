const {StatusCodes} = require("http-status-codes");
const catchAsync= require("../../../shared/catchAsync")
const CategoryService= require("./category.service");

exports.createCategory= catchAsync(async(req, res)=>{
    const {...categoryData} = req.body;
    let image = "";
    if (req.files && "image" in req.files && req.files.image[0]) {
        bannerImage = `/images/${req.files.image[0].filename}`;
    }
    
    const data = {
        ...categoryData,
        image,
    };
    await CategoryService.createCategory(data);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Category Created Successfully"
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
    const {...categoryData} = req.body;
    let image = "";
    if (req.files && "image" in req.files && req.files.image[0]) {
        bannerImage = `/images/${req.files.image[0].filename}`;
    }
    
    const data = {
        ...categoryData,
        image,
    };
    await CategoryService.updateCategory(id, data);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Category updated Successfully"
    })
});

exports.getCategory= catchAsync(async(req, res)=>{
    
});