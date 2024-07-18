const express = require("express");
const configureFileUpload = require("../../middlewares/fileHandler");
const router = express.Router();
const AuthController = require("./auth.controller")
const auth = require("../../middlewares/auth.js");
const { USER_ROLE } = require("../../../enums");

router.post("/register-user", configureFileUpload(), AuthController.register);
router.post("/verify-otp", AuthController.verifyEmail);
router.post("/login", configureFileUpload(), AuthController.login);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", auth(USER_ROLE.SALON, USER_ROLE.USER,), AuthController.resetPassword);
router.post("/change-password", auth(USER_ROLE.SALON, USER_ROLE.USER,), AuthController.changePassword);
router.patch("/update-profile", auth(USER_ROLE.ADMIN, USER_ROLE.SALON, USER_ROLE.USER, USER_ROLE.SUPER_ADMIN), configureFileUpload(), AuthController.updateProfile);
router.get("/get-profile", auth(USER_ROLE.ADMIN, USER_ROLE.SALON, USER_ROLE.USER, USER_ROLE.SUPER_ADMIN), AuthController.getProfileFromDB);
router.delete("/delete-profile", auth(USER_ROLE.ADMIN, USER_ROLE.SALON), AuthController.deleteProfileFromDB);
module.exports = router;