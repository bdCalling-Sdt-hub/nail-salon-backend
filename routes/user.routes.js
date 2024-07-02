const express = require("express");
const router = express.Router();
const configureFileUpload = require("../middlewares/fileUpload.js");
const auth = require("../middlewares/auth.js");
const { USER_ROLE } = require("../enums/user.js");
const {
  userRegister,
  verifyEmail,
  forgotPassword,
  otpVerify,
  resetPassword,
  changePassword,
  updateProfile,
  makeFollower,
  deleteAccount,
  makeInterest,
  getProfileFromDB,
  getProfileByIDFromDB,
  getTopArtistFromDB,
  getAllArtistFromDB,
  userLogin,
} = require("../controllers/user.controller.js");

router.post("/register", configureFileUpload(), userRegister);
router.post("/verify-email", configureFileUpload(), verifyEmail);
router.post("/login", configureFileUpload(), userLogin);
router.post("/forgot-password", configureFileUpload(), forgotPassword);
router.post("/otp-verify", configureFileUpload(), otpVerify);

router.post("/reset-password", configureFileUpload(), resetPassword);

router.post(
  "/change-password",
  auth(USER_ROLE.ADMIN, USER_ROLE.ARTIST, USER_ROLE.USER),
  configureFileUpload(),
  changePassword
);
router.post(
  "/update-profile",
  auth(USER_ROLE.ADMIN, USER_ROLE.ARTIST, USER_ROLE.USER),
  configureFileUpload(),
  updateProfile
);
router.post(
  "/make-follower/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.ARTIST, USER_ROLE.USER),
  configureFileUpload(),
  makeFollower
);
router.patch(
  "/delete-account/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.ARTIST, USER_ROLE.USER),
  deleteAccount
);
router.patch(
  "/make-interest",
  configureFileUpload(),
  auth(USER_ROLE.ADMIN, USER_ROLE.ARTIST, USER_ROLE.USER),
  makeInterest
);

router.get(
  "/get-profile",
  auth(USER_ROLE.ADMIN, USER_ROLE.ARTIST, USER_ROLE.USER),
  getProfileFromDB
);

router.get(
  "/get-profile-id/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.ARTIST, USER_ROLE.USER),
  getProfileByIDFromDB
);
router.get(
  "/get-top-artist",
  auth(USER_ROLE.ARTIST, USER_ROLE.USER),
  getTopArtistFromDB
);

router.get("/get-all-artist", auth(USER_ROLE.ADMIN), getAllArtistFromDB);

exports.UserRoutes = router;
