const ApiError = require("../../../errors/ApiError");
const User = require("../user/user.model");
const { StatusCodes } = require("http-status-codes");
const Salon = require("../salon/salon.model");
const Category = require("../category/category.model");
const Review = require("../review/review.model");
const Service = require("../Service/service.model");
const unlinkFile = require("../../../util/unlinkFile");

exports.updateSalon=async(user, payload)=>{
    const {name, location, gallery, profileImage, ...othersPayload} = payload;
    const isExistSalon = await User.findById({_id: user?._id});
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

    if(profileImage && isExistSalon?.profileImage?.startsWith("https")){
        othersPayload.profileImage = profileImage;
    }else{
        othersPayload.profileImage = profileImage;
        unlinkFile(isExistSalon.profileImage)
    }


    salon = await User.findByIdAndUpdate({_id: isExistSalon._id}, othersPayload, {new: true})
    return salon;
}

exports.getFeaturedSalon=async()=>{
    
    const salons = await User.find({featured: true});
    if(!salons){
        throw new ApiError(StatusCodes.NOT_FOUND, "No Salon Found");
    }
    return salons;
}

exports.makeFeaturedSalon=async(id)=>{
    const salon = await User.findById(id);
    if(!salon){
        throw new ApiError(StatusCodes.NOT_FOUND, "No Salon Found");
    }
    const result = await User.findByIdAndUpdate({_id: id}, {$set: {featured: !salon.featured}}, {new: true})

    return result
}

exports.salonListFromDB=async(queries)=>{
    const {featured, page, limit, location} = queries;
    
    let query= {
        role: "SALON"
    };


    if(location){
        let regex = new RegExp(location, 'i');
        query.location = regex;
    }

    const pages = parseInt(page) || 1;
    const size = parseInt(limit) || 10;
    const skip = (pages - 1) * size;

    const salonList = await User.aggregate([
        { $match: query },
        {
          $lookup: {
                from: "salons",
                localField: "salon",
                foreignField: "_id",
                as: "salon"
            }
        },
        {
            $unwind: "$salon"
        },
        {
            $match: featured === "true" ? { "salon.featured": true } : {}
        },
        { $skip: skip },
        { $limit: size }
    ]);

    const count = await User.countDocuments({role: "SALON"});

    return {
        data: salonList,
        meta: {
            page: pages,
            total: count
        }
    };
}

exports.salonDetailsFromDB=async(id)=>{
    
    const salon = await User.findOne({_id: id}).populate("salon");
    const reviews = await Review.find({salon: id}).populate("user");
    const category= await Category.find({});
    if(!salon){
        throw new ApiError(StatusCodes.NOT_FOUND, "User doesn't exists")
    }

    return {
        salon,
        category,
        reviews
    };
}

exports.salonsFromDB=async(queries)=>{
    const {search, rating, gender, category} = queries;
    
    let query= {};


    if(search){
        let regex = new RegExp(search, 'i');
        query.serviceName= regex;

        const results = await Service.find(query).populate('salon').exec();
        const filteredResults = results.filter(item => item.salon && regex.test(item.salon.location));
        return filteredResults;
    }

    if(gender){
        let regex = new RegExp(gender, 'i');
        query.gender = regex;
    }
    
    if(category){
        query.category = category;
    }

    if (rating) {
        query.rating = { $gte: 0, $lte: Number(rating) };
    }

    console.log(query)

    return result = await Service.find(query).populate("user");
}