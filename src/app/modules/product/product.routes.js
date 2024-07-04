const express = require("express");
const auth = require("../../middlewares/auth");
const { USER_ROLE } = require("../../../enums");
const configureFileUpload = require("../../middlewares/fileHandler");
const ProductController = require("./product.controller");
const router = express.Router();

router.post("/", auth(USER_ROLE.SALON), configureFileUpload(), ProductController.createProduct);
router.get("/", auth(USER_ROLE.SALON), ProductController.getProductsFromDB);
router.delete("/:id", auth(USER_ROLE.SALON), ProductController.deleteProductFromDB);
router.patch("/:id", auth(USER_ROLE.SALON), configureFileUpload(),  ProductController.updateProductToDB);
router.patch("/update-quantity/:id", auth(USER_ROLE.SALON), configureFileUpload(),  ProductController.updateProductQuantityToDB);

module.exports=router;