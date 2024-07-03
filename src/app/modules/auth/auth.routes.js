const express = require("express");
const configureFileUpload = require("../../middlewares/fileHandler");
const router = express.Router();
const AuthController = require("./auth.controller")

router.post("/register-user", configureFileUpload(), AuthController.register);
router.post("/email-verify", AuthController.verifyEmail);
router.post("/login-user", configureFileUpload(), AuthController.login);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/verify-otp", AuthController.verifyEmail);
router.post("/reset-password", AuthController.resetPassword);
router.post("/update-profile", AuthController.updateProfile);
router.post("/get-profile", AuthController.getProfileFromDB);
module.exports = router;