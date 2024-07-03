const {StatusCodes} = require("http-status-codes");
const ApiError = require("../../../errors/ApiError");
const Booking = require("./booking.model");

exports.createBooking= async(payload)=>{
    const booking = await Booking.create(payload);
    return booking;
}

exports.myBooking= async(id, status)=>{
    const booking = Booking.find({user: id}, {status: status});
    return booking;
}