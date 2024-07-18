const express = require("express");
const BannerController = require("./banner.controller");
const configureFileUpload = require("../../../app/middlewares/fileHandler");
const auth = require("../../middlewares/auth.js");
const { USER_ROLE } = require("../../../enums");
const router = express.Router();

router.post("/create-banner", auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), configureFileUpload(), BannerController.createBanner);
router.patch("/update-banner/:id", auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), configureFileUpload(), BannerController.updateBanner);
router.delete("/delete-banner/:id", auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), BannerController.deleteBanner);
router.get("/get-banners", auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), BannerController.getAllBanner);


module.exports = router;