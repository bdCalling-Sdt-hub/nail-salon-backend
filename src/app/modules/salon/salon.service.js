const ApiError = require("../../../errors/ApiError");
const User = require("../user/user.model");
const { StatusCodes } = require("http-status-codes");
const Salon = require("../salon/salon.model");

exports.updateSalon=async(user, payload)=>{
    const {name, location, gallery, ...othersPayload} = payload;
    const isExistSalon = await Salon.findOne({user: user?._id});
    if(!isExistSalon){
        throw new ApiError(StatusCodes.NOT_FOUND, "No Salon Found");
    }

    let salon;
    if(name || location){
        const data = {
            name: name,
            location: location
        }
        salon = await User.findByIdAndUpdate({_id: user._id}, data, {new: true})
    }

    if(gallery){
        isExistSalon.gallery.push(gallery);
        await isExistSalon.save();
        return salon;
    }


    salon = await Salon.findByIdAndUpdate({_id: isExistSalon._id}, othersPayload, {new: true})
    return salon;
}

exports.getFeaturedSalon=async()=>{
    const salons = await Salon.find({}).sort({ rating: -1 });
    if(!salons){
        throw new ApiError(StatusCodes.NOT_FOUND, "No Salon Found");
    }
    return salons;
}