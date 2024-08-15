const Notification = require("./notification.model");
const mongoose = require("mongoose");

exports.adminNotifications=async(query)=>{
    const {page} = query;
    const limit = 10;

    const pages = parseInt(page) || 1;
    const size = parseInt(limit) || 10;
    const skip = (pages - 1) * size;

    const result = await Notification.find({type: "ADMIN"}).skip(skip).limit(size);
    return {
        notifications: result,
        meta: {
            page: pages,
            total: result?.length
        }
    };
};

exports.notifications=async(user, query)=>{
    const {page} = query;
    const limit = 10;

    const pages = parseInt(page) || 1;
    const size = parseInt(limit) || 10;
    const skip = (pages - 1) * size;

    const result = await Notification.find({user: new mongoose.Types.ObjectId(user?._id)}).skip(skip).limit(size);
    const total = result?.length
    const totalPage = Math.ceil(total / limit);
    return {
        notifications: result,
        meta: {
            page: pages,
            totalPage,
            total
        }
    };
};

exports.readNotification=async(user)=>{
    await Notification.updateMany(
        { user: new mongoose.Types.ObjectId(user._id)},
        { $set: { read: true } }
    );
    return ;
};