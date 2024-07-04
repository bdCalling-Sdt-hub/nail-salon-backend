const {StatusCodes} = require("http-status-codes");
const ApiError = require("../../../errors/ApiError");
const Booking = require("./booking.model");

exports.createBooking= async(payload)=>{
    const booking = await Booking.create(payload);
    if(!booking){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Booked A Booking")
    }
    return booking;
}

exports.myBooking= async(user, status)=>{
    const filter  = user.role === "USER" ? {user : user?._id} : {salon : user?._id} 
    let query= {
        ...filter
    }

    if(status === "Pending"){
        query.status = "Pending"
    }

    if(status === "Complete"){
        query.status = "Complete"
    }

    const booking = await Booking.find(query).populate(["user", "salon", "service"]);

    // Filter bookings for salon by booking_date greater than today
    const today = new Date().toISOString().split('T')[0];
    const newBooking = await Booking.find({
        salon: user?._id,
        booking_date: { $gt: today } // Filter for booking dates greater than today
    }).populate(["user", "salon", "service"]);

    const bookingDates = [...new Set(newBooking.map(item => item.booking_date))];

    return {booking, bookingDates};
}

exports.bookingDetails= async(id)=>{
    
    const booking = await Booking.findById(id).populate(["user", "salon", "service"]);
    return booking;
}