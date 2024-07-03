const express = require("express");
const BannerController = require("./banner.controller");
const configureFileUpload = require("../../../app/middlewares/fileHandler");
const router = express.Router();

router.post("/create-banner", configureFileUpload(), BannerController.createBanner);
router.patch("/update-banner/:id", configureFileUpload(), BannerController.updateBanner);
router.delete("/delete-banner/:id", BannerController.deleteBanner);
router.get("/get-banners", BannerController.getAllBanner);


module.exports = router;