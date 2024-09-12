const {StatusCodes} = require("http-status-codes");
const ApiError = require("../../../errors/ApiError");
const Booking = require("./booking.model");
const mongoose = require("mongoose");
const User = require("../user/user.model");
const Notification = require("../notifications/notification.model");
const EmailHelper = require("../../../helper/emailHelper");

exports.createBooking= async(user, payload)=>{
    const isExistUser = await User.findById(user._id);
    if(!isExistUser){
        throw new ApiError(StatusCodes.NOT_FOUND, "No User Found to Booking Salons")
    }

    const booking = await Booking.create(payload);
    if(!booking){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Booked A Booking")
    }

    const data ={
        text: `${isExistUser?.name} Booking On Your Salons`,
        user: payload?.salon,
        title: "A New Service has Booked",
        type: "ADMIN"
    }

    if(booking?._id){
        const result = await Booking.findById(booking?._id).populate("user salon service");
        const emailData = {
            to: result?.user?.email,
            name: result?.user?.name,
            salon: result?.salon?.name,
            email: result?.salon?.email,
            contact: result?.salon?.phone,
            date: booking?.booking_date,
            time: booking?.booking_time,
            services: booking?.service,
    
        }
        await EmailHelper.bookingConfirmation(emailData)
    }


    const result =  await Notification.create(data)
    io.emit(`get-notification::${payload.salon}`, result);

    return booking;
}

exports.myBooking= async(user, status)=>{
    const filter  = user.role === "USER" ? {user : user?._id} : {salon : user?._id} 
    let query= {
        ...filter
    }

    if (status) {
        if (status === "Pending") {
            query.status = "Pending";
        } else if (status === "Complete") {
            query.status = "Complete";
        } else {
            query.booking_date = status;
        }
    }

    const booking = await Booking.find(query).populate([
        {
            path: 'salon',
            select: "name location phone profileImage"
        },
        {
            path: "user",
            select: "name profileImage"
        }
    ]).select("_id user salon price bookingId booking_date transactionId booking_time");

    // Filter bookings for salon by booking_date greater than today
    const today = new Date().toISOString().split('T')[0];
    const newBooking = await Booking.find({
        salon: user?._id,
        booking_date: { $gt: today } // Filter for booking dates greater than today
    }).populate(["user", "salon"]);

    const bookingDates = [...new Set(newBooking.map(item => item.booking_date))];

    return {booking, bookingDates};
}

exports.bookingDetails= async(id)=>{
    const booking = await Booking.findById(id).populate([
        {
            path: 'salon',
            select: "name location phone"
        },
        {
            path: "user",
            select: "name profileImage"
        },
        {
            path: 'service',
            select: 'serviceName price',
            model: 'Service'
        }
    ])
    .select("_id user service salon price bookingId booking_date transactionId booking_time");
    return booking;
}


exports.weeklyBooking= async(user)=>{
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()).toISOString().split('T')[0]; // Start of current week (Sunday)
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7).toISOString().split('T')[0]; // End of current week (Saturday)

    const weeklyBooking = await Booking.find({
        salon: user?._id,
        createdAt: { $gte: startOfWeek, $lt: endOfWeek } // Filter for booking dates within the current week
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

    weeklyBooking.forEach(booking => {
        const bookingDate = new Date(booking.booking_date);
        const bookingDay = bookingDate.getDay();
        
        // Correct mapping of days to indices in your weeklyIncome array
        const incomeIndex = bookingDay === 0 ? 1 : bookingDay; // Adjust Sunday to map correctly
    
        // Ensure that the index exists before trying to access income
        if (weeklyIncome[incomeIndex]) {
            weeklyIncome[incomeIndex].income += parseInt(booking?.price || 0);
        }
    });    

    return weeklyIncome;
}

exports.bookingSummary= async(user)=>{
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()); // Start of current week (Sunday)
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7); // End of current week (Saturday)


    // my balance
    const totalIncome = await Booking.aggregate([
        { $match: { salon: new mongoose.Types.ObjectId(user._id) } },
        { 
            $group: { 
                _id: null, 
                totalIncomes: { $sum:  { $toDouble: "$price" }}
            } 
        },
        {
            $project: {
                totalIncomes: 1,
                incomeAfterDeduction: { $subtract: ["$totalIncomes", { $multiply: ["$totalIncomes", 0.08] }] }
            }
        }
    ]);
    const myBalance = totalIncome[0]?.totalIncomes || 0; 

    // total client
    const totalUser = await Booking.find({salon: user?._id}).populate("user");
    const totalClient = [...new Set(totalUser.map(item => item.user._id))]?.length;

    // weekly total income
    const weeklyIncome = await Booking.aggregate([
        {
            $match: {
                salon: new mongoose.Types.ObjectId(user._id),
                createdAt: {
                    $gte: startOfWeek,
                    $lt: endOfWeek
                }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$price" }
            }
        }
    ]);
    
    const weeklyTotalIncome = weeklyIncome[0]?.total || 0;

    return {myBalance, weeklyTotalIncome, totalClient};
}

exports.bookingListFromDB= async(queries)=>{
    const {status, booking_date, page, limit} = queries;
    let query= {};
    if(status){
        query.status = status
    }
    if(booking_date){
        query.booking_date=booking_date
    }

    const pages = parseInt(page) || 1;
    const size = parseInt(limit) || 10;
    const skip = (pages - 1) * size;

    const bookingList = await Booking.find(query).populate([
        {
            path: "user",
            select: "name profileImage" 
        },
        {
            path: "salon",
            select: "name location contact " 
        },
        {
            path: "service",
            select: "serviceName price" 
        },
    ]).skip(skip).limit(size);
    const count = await Booking.estimatedDocumentCount();
    return {
        data: bookingList,
        meta: {
            page: pages,
            total: count
        }
    };
};

exports.bookingCompleteToDB= async(id, user)=>{
    const isExitBooking = await Booking.findById(id);
    if(!isExitBooking){
        throw new ApiError(StatusCodes.NOT_FOUND, "No Booking Found");
    }

    if(isExitBooking?.user.toString() !== user?._id.toString()){
        throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized to this resource");
    }

    const result = await Booking.findByIdAndUpdate({_id: id}, {$set: {status: "Complete"}}  , {new: true})
    return result;
}

// weekly summary for salon
exports.weeklySummaryFromDB= async(user)=>{

    // week calculate
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()); // Start of current week (Sunday)
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7); // End of current week (Saturday)

    // weekly total client
    const weeklyClients = await Booking.aggregate([
        {
            $match: {
                salon: new mongoose.Types.ObjectId(user._id),
                createdAt: { $gte: startOfWeek, $lt: endOfWeek }
            }
        },
            {
                $group: {
                    _id: null,
                    uniqueUsers: { $addToSet: "$user" }
                }
            },
        {
            $project: {
                _id: 0,
                count: { $size: "$uniqueUsers" }
            }
        }
    ]);
    const weeklyTotalClient = weeklyClients[0]?.count || 0;

    // weekly repeated client;
    const repeatedClient = await Booking.aggregate([
        {
            $match: {
                salon: new mongoose.Types.ObjectId(user._id),
                createdAt: {
                    $gte: startOfWeek,
                    $lt: endOfWeek
                }
            }
        },
        {
            $group: {
                _id: "$user",
                bookingCount: { $sum: 1 }
            }
        },
        {
            $match: {
                bookingCount: { $gt: 1 }
            }
        },
        {
            $count: "repeatClientCount"
        }
    ]);
    const repeatClients = repeatedClient[0]?.repeatClientCount || 0;

    // weekly new client;
    const newTotalClients = await Booking.aggregate([
        {
            $match: {
                salon: new mongoose.Types.ObjectId(user._id),
                createdAt: {
                    $gte: startOfWeek,
                    $lt: endOfWeek
                }
            }
        },
        {
            $group: {
                _id: "$user",
                bookingCount: { $sum: 1 }
            }
        },
        {
            $match: {
                bookingCount: { $eq: 1 }
            }
        },
        {
            $count: "newClientCount"
        }
    ]);
    const newClients = newTotalClients[0]?.newClientCount || 0;


    // all clients;
    const uniqueUserIds = await Booking.distinct("user", { salon: user?._id });
    const totalClients = await User.countDocuments({ _id: { $in: uniqueUserIds } });

    return {totalClients, weeklyTotalClient, repeatClients, newClients};
}

// weekly clients for salon
exports.weeklyClientsFromDB= async(user, status)=>{
    // week
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()); // Start of current week (Sunday)
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7); // End of current week (Saturday)

    let uniqueUserIds;
    if( status === "weeklyTotal"){
        uniqueUserIds = await Booking.distinct("user", 
            { 
                salon: user?._id, 
                createdAt: {
                    $gte: startOfWeek,
                    $lt: endOfWeek
                } 
            }
        )
    }

    // new Clients; 
    if( status ===  "newClient"){
        const newClient = await Booking.aggregate([
            {
                $match: {
                    salon: new mongoose.Types.ObjectId(user._id),
                    createdAt: {
                        $gte: startOfWeek,
                        $lt: endOfWeek
                    }
                }
            },
            {
                $group: {
                    _id: "$user",
                    bookingCount: { $sum: 1 }
                }
            },
            {
                $match: {
                    bookingCount: { $eq: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    newClientIds: { $push: "$_id" }
                }
            }
        ]);
        uniqueUserIds = newClient[0]?.newClientIds || [];
    }

    // repeated client
    if( status === "repeated"){
        const result = await Booking.aggregate([
            {
                $match: {
                    salon: new mongoose.Types.ObjectId(user._id), // Ensure user._id is an ObjectId
                    createdAt: {
                        $gte: startOfWeek,
                        $lt: endOfWeek
                    }
                }
            },
            {
                $group: {
                    _id: "$user",
                    bookingCount: { $sum: 1 }
                }
            },
            {
                $match: {
                    bookingCount: { $gt: 1 } // Users with more than one booking
                }
            },
            {
                $group: {
                    _id: null,
                    multipleBookingUserIds: { $push: "$_id" }
                }
            },
            {
                $project: {
                    _id: 0,
                    multipleBookingUserIds: 1
                }
            }
        ]);

        uniqueUserIds = result[0]?.multipleBookingUserIds;
    }

    
    // If no specific query was found, fetch all clients
    if (!status) {
        uniqueUserIds = await Booking.distinct("user", { salon: user?._id });
    }

    // main query;
    const allClients = await User.find({ _id: { $in: uniqueUserIds } }).select("_id name profileImage email");

    return allClients;
}

// weekly clients for salon
exports.lastBookingFromDB= async(id)=>{
    
    const isLastBooking = await Booking.findOne({ user: new mongoose.Types.ObjectId(id) }).populate([
        {
            path: "user",
            select: "name profileImage phone email"
        },
        {
            path: "service",
            select: "serviceName price"
        },

    ]).sort({ createdAt: -1 }).limit(1).select("user price service booking_date");

    if(!isLastBooking){
        throw new ApiError(StatusCodes.NOT_FOUND, "No Booking Found")
    }

    return isLastBooking;
}


// My Balance for Salon
exports.myBalance= async(user)=>{
    const balances = await Booking.find({salon: user?._id}).populate({path: "user", select: "name profileImage email"}).select("price");
    return balances;
}


// reschedule booking;
exports.reschedule= async(payload, id)=>{

    const isExistBooking = await Booking.findById(id).populate("user");
    if(!isExistBooking){
        throw new ApiError(StatusCodes.NOT_FOUND, "There is No booking Found");
    }

    const payloadData= {
        ...payload,
        price: parseInt(isExistBooking.price) + 5,
        fine: 5
    }

    const data ={
        title: "Rescheduled Booking",
        text: `${isExistBooking?.user?.name} Reschedule Booking`,
        user: isExistBooking?.salon,
        type: "ADMIN"
    }


    const notification =  await Notification.create(data)
    io.emit(`get-notification::${isExistBooking.salon}`, notification);


    const result = await Booking.findByIdAndUpdate({_id: id}, payloadData, {new : true})
    return result;
}

// check booking;
exports.checkBooking= async(payload, id)=>{

    const { booking_date, booking_time} = payload;

    const isExitsDate = await Booking.findOne({ salon: new mongoose.Types.ObjectId(id), booking_date: booking_date, booking_time: booking_time });
    if(isExitsDate){
        throw new ApiError(StatusCodes.NOT_FOUND, "This is Date And Time already Booked");
    }

    return;
}