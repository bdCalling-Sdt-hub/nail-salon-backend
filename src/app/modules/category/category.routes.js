const express = require("express");
const configureFileUpload= require("../../middlewares/fileHandler");
const CategoryController = require("./category.controller");
const auth = require("../../middlewares/auth.js");
const { USER_ROLE } = require("../../../enums");
const router= express.Router();

router.post("/create-category", auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), configureFileUpload(), CategoryController.createCategory)
router.delete("/delete-category/:id", auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), CategoryController.deleteCategory)
router.patch("/update-category/:id", auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), configureFileUpload(), CategoryController.updateCategory)
router.get("/get-category", auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), CategoryController.getCategory)

module.exports = router