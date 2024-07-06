const express = require("express");
const router = express.Router();
const AdminController = require("./admin.controller");
const auth = require("../../middlewares/auth");
const { USER_ROLE } = require("../../../enums");
const configureFileUpload = require("../../middlewares/fileHandler");

router.post("/", auth(USER_ROLE.SUPER_ADMIN),  configureFileUpload(), AdminController.makeAdmin);
router.get("/", auth(USER_ROLE.SUPER_ADMIN), AdminController.getAdmin);
router.delete("/:id", auth(USER_ROLE.SUPER_ADMIN), AdminController.deleteAdmin);
router.post("/login", configureFileUpload(), AdminController.adminLogin);
router.post("/forgot-password", configureFileUpload(), AdminController.forgotPassword);
router.post("/verify-otp",configureFileUpload(), AdminController.verifyEmail);
router.post("/reset-password",configureFileUpload(), AdminController.resetPassword);
router.patch("/update-profile", auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), configureFileUpload(), AdminController.updateProfile);
router.post("/change-password", auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), configureFileUpload(), AdminController.changePassword);
router.get("/get-profile", auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),   AdminController.getProfileFromDB);

module.exports = router;