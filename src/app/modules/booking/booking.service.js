const {StatusCodes} = require("http-status-codes");
const ApiError = require("../../../errors/ApiError");
const Booking = require("./booking.model");
const { default: mongoose } = require("mongoose");

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

    const booking = await Booking.find(query).populate(["user", "salon"]);

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
    
    const booking = await Booking.findById(id).populate(["user", "salon"]);
    return booking;
}

exports.weeklyBooking= async(user)=>{
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()).toISOString().split('T')[0]; // Start of current week (Sunday)
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7).toISOString().split('T')[0]; // End of current week (Saturday)

    const weeklyBooking = await Booking.find({
        salon: user?._id,
        booking_date: { $gte: startOfWeek, $lt: endOfWeek } // Filter for booking dates within the current week
    }).populate(["user", "salon"]);

    // here define all days with 0 income 
    const weeklyIncome = [
        { name: "Sat", income: 0 },
        { name: "Sun", income: 0 },
        { name: "Mon", income: 0 },
        { name: "Tue", income: 0 },
        { name: "Wed", income: 0 },
        { name: "Thu", income: 0 },
        { name: "Fri", income: 0 },
    ];

    // here calculating per day income
    weeklyBooking.forEach(booking => {
        const bookingDate = new Date(booking.booking_date);
        const bookingDay = bookingDate.getDay();
        const incomeIndex = bookingDay === 0 ? 6 : bookingDay - 1;
        weeklyIncome[incomeIndex].income += parseInt(booking?.price);
    });



    const weeklyTotalIncome2 = await Booking.aggregate([
        { $match: { 
                salon: new mongoose.Types.ObjectId(user._id),
                createdAt: {
                    $gte: new Date(startOfWeek),
                    $lt: new Date(endOfWeek),
                } 
            }
        },
        { $group: { _id: null, totalIncomes: { $sum: "$price" } } },
    ]);
    

    const totalIncome = await Booking.aggregate([
        { $match: { salon: new mongoose.Types.ObjectId(user._id) } },
        { $group: { _id: null, totalIncomes: { $sum: "$price" } } },
    ]);

    const totalClient = await Booking.countDocuments({salon: user?._id})


    console.log("totalIncome", totalIncome[0].totalIncomes)
    console.log("totalClient", totalClient)
    console.log("weeklyTotalIncome", weeklyTotalIncome2)



    return weeklyIncome;
}