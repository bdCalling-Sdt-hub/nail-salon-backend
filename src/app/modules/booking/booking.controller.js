const BookingService = require("./booking.service");
const catchAsync = require("../../../shared/catchAsync");
exports.createBooking= catchAsync(async(req, res)=>{
    const user = req.user._id;
    const data = {
        user,
        ...req.body,
    }
    const booking = await BookingService.createBooking(data);
    return booking;
})

exports.myBooking= async(payload)=>{
    const id=req.user._id;
    const query=req.params.status
    const booking = BookingService.myBooking(id, query);
    return booking;
}