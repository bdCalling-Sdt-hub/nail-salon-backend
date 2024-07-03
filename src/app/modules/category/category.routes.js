const express = require("express");
const router= express.Router();
const configureFileUpload= require("../../middlewares/fileHandler");
const CategoryController = require("./category.controller");

router.post("/create-category", configureFileUpload(), CategoryController.createCategory)
router.delete("/delete-category/:id", CategoryController.deleteCategory)
router.patch("/update-category/:id", configureFileUpload(), CategoryController.updateCategory)
router.get("/get-category", CategoryController.getCategory)

module.exports = router