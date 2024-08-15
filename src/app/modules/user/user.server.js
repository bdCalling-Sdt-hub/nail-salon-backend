const ApiError = require("../../../errors/ApiError");
const { StatusCodes } = require("http-status-codes");
const User = require("./user.model");

exports.getUserList=async(queries)=>{
    const {location, page, limit} = queries;
    const query= {
        role: "USER"
    }

    const pages = parseInt(page) || 1;
    const size = parseInt(limit) || 10;
    const skip = (pages - 1) * size;

    if(location){
        let regex = new RegExp(location, 'i');
        query.location = regex;
    }

    const users = await User.find(query).skip(skip).limit(size).select("name email profileImage location phone");
    return {
        users: users,
        meta: {
            page: pages,
            total: users?.length
        }
    }
}