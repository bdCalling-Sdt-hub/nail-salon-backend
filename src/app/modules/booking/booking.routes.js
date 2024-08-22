const express = require("express");
const BookingController = require("./booking.controller");
const configureFileUpload = require("../../middlewares/fileHandler");
const router = express.Router();
const auth = require("../../middlewares/auth");
const { USER_ROLE } = require("../../../enums");

router.post("/", auth(USER_ROLE.USER),  configureFileUpload(), BookingController.createBooking);
router.get("/", auth(USER_ROLE.USER, USER_ROLE.SALON), BookingController.myBooking);
router.get("/weekly-booking", auth(USER_ROLE.SALON), BookingController.weeklyBooking);
router.get("/weekly-summary", auth(USER_ROLE.SALON), BookingController.weeklySummaryFromDB);
router.get("/weekly-client", auth(USER_ROLE.SALON), BookingController.weeklyClientsFromDB);
router.get("/booking-summary", auth(USER_ROLE.SALON), BookingController.bookingSummary);
router.get("/booking-list", auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), BookingController.bookingListFromDB);
router.get("/complete/:id", auth(USER_ROLE.USER), BookingController.bookingCompleteToDB);
router.get("/last-booking/:id", auth(USER_ROLE.SALON), BookingController.lastBookingFromDB);
router.post("/create-payment-intent", auth(USER_ROLE.USER), BookingController.createPaymentIntent);
router.get("/my-balance", auth(USER_ROLE.SALON), BookingController.myBalance);
router.patch("/reschedule/:id", auth(USER_ROLE.USER), configureFileUpload(), BookingController.reschedule);
router.post("/check-booking/:id", auth(USER_ROLE.USER), BookingController.checkBooking);
router.get("/:id", auth(USER_ROLE.USER, USER_ROLE.SALON), BookingController.bookingDetails);

module.exports = router;