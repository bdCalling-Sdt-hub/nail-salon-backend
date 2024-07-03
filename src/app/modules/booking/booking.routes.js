const express = require("express");
const BookingController = require("./booking.controller");
const configureFileUpload = require("../../middlewares/fileHandler");
const router = express.Router();

router.post("/create-booking", configureFileUpload(), BookingController.createBooking);
router.get("/my-booking", BookingController.myBooking);


module.exports = router;