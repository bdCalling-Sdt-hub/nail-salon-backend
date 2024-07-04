const {model, Schema} = require("mongoose");

const bookingSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        salon: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        service: {
            type: Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },
        bookingId: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "Complete"],
            default: "Pending"
        },
        booking_date: {
            type: String,
            required: true
        },
        transactionId: {
            type: String,
            require: true
        },
        booking_time: {
            type: String,
            required: true
        }
    }
);

const Booking = model("Booking", bookingSchema);
module.exports = Booking;