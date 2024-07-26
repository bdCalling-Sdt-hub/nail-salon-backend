const BookingService = require("./booking.service");
const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const { StatusCodes } = require("http-status-codes");


exports.createBooking= catchAsync(async(req, res)=>{
    const user = req.user._id;
    const data = {
        user,
        ...req.body,
    }
    const booking = await BookingService.createBooking(data);
    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Booking Booked Successfully",
        data: booking
    })
});

exports.myBooking= catchAsync(async(req, res)=>{
    const user =req.user;
    const status =req.query.status;

    const {booking, bookingDates} = await BookingService.myBooking(user, status);
    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Booking Retrieve Successfully",
        data: {
            booking,
            bookingDates
        }
    })
});

exports.bookingDetails= catchAsync(async(req, res)=>{
    const id =req.params.id;

    const booking = await BookingService.bookingDetails(id);
    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Booking Retrieve Successfully",
        data: booking
    })
});


exports.weeklyBooking= catchAsync(async(req, res)=>{
    const user = req.user;
    const booking = await BookingService.weeklyBooking(user);

    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Booking Retrieve Successfully",
        data: booking
    })
});

exports.bookingSummary= catchAsync(async(req, res)=>{
    const user = req.user;
    const booking = await BookingService.bookingSummary(user);

    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Booking Summery Retrieve Successfully",
        data: booking
    })
});

exports.bookingListFromDB= catchAsync(async(req, res)=>{
    const query = req.query;
    const booking = await BookingService.bookingListFromDB(query);

    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Booking Retrieve Successfully",
        data: booking
    })
});

exports.bookingCompleteToDB= catchAsync(async(req, res)=>{
    const id = req.params.id;
    const user = req.user;
    await BookingService.bookingCompleteToDB(id, user);

    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Booking Completed"
    })
});