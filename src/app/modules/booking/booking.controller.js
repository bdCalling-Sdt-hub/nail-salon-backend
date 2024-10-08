const BookingService = require("./booking.service");
const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const { StatusCodes } = require("http-status-codes");
const ApiError = require("../../../errors/ApiError");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


exports.createBooking= catchAsync(async(req, res)=>{
    const user = req.user;
    const payload = { user: user?._id, ...req.body}
    const booking = await BookingService.createBooking(user, payload);
    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Booking Confirm",
        data: booking
    })
});

exports.myBooking= catchAsync(async(req, res)=>{
    const user =req.user;
    const status =req.query.status;
    const date =req.query.date;

    const {booking, bookingDates} = await BookingService.myBooking(user, status, date);
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
    const result = await BookingService.bookingCompleteToDB(id, user);

    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Booking Completed",
        data: result
    })
});

// weekly summary for salon
exports.weeklySummaryFromDB= catchAsync(async(req, res)=>{
    const user = req.user;
    const result = await BookingService.weeklySummaryFromDB(user);

    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Weekly Summary",
        data: result
    })
});

// weekly all client;
exports.weeklyClientsFromDB= catchAsync(async(req, res)=>{
    const user = req.user;
    const status =req.query.status;
    const result = await BookingService.weeklyClientsFromDB(user, status);

    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Weekly Summary",
        data: result
    })
});

// weekly all client;
exports.lastBookingFromDB= catchAsync(async(req, res)=>{
    const id = req.params.id;
    const result = await BookingService.lastBookingFromDB(id);

    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Last Booking Details",
        data: result
    })
});


//create stripe instance
exports.createPaymentIntent= catchAsync(async(req, res)=>{
    const { price } = req.body;

    if ( parseInt(price) <= 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid price amount");
    }
    const amount = Math.trunc(parseInt(price) * 100);
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "gbp",
        payment_method_types: ["card"],
        metadata: { integration_check: 'accept_a_payment' }
    });

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Payment intent created successfully",
        data: {
            client_secret: paymentIntent.client_secret,
            transactionId: paymentIntent.id,
        },
    });
});

//my balance
exports.myBalance= catchAsync(async(req, res)=>{
    const user = req.user;
    const result = await BookingService.myBalance(user);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "My Booking balance retrieved successfully",
        data: result
    });
});

//reschedule
exports.reschedule= catchAsync(async(req, res)=>{
    const id = req.params.id;
    const payload = req.body;
    const result = await BookingService.reschedule(payload, id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Rescheduled Booking successfully",
        data: result
    });
});

//reschedule
exports.checkBooking= catchAsync(async(req, res)=>{
    const payload = req.body;
    const id = req.params.id;
    const result = await BookingService.checkBooking(payload, id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Checked Booking",
        data: result
    });
});