const express = require("express");
const BookingController = require("./booking.controller");
const configureFileUpload = require("../../middlewares/fileHandler");
const router = express.Router();
const auth = require("../../middlewares/auth");
const { USER_ROLE } = require("../../../enums");

router.post("/", auth(USER_ROLE.USER),  configureFileUpload(), BookingController.createBooking);
router.get("/", auth(USER_ROLE.USER, USER_ROLE.SALON), BookingController.myBooking);
router.get("/:id", auth(USER_ROLE.USER, USER_ROLE.SALON), BookingController.bookingDetails);


module.exports = router;