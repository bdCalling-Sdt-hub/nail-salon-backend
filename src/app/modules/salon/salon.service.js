const ApiError = require("../../../errors/ApiError");
const User = require("../user/user.model");
const { StatusCodes } = require("http-status-codes");
const Category = require("../category/category.model");
const Review = require("../review/review.model");
const Wishlist = require("../wishlist/wishlist.model");
const Service = require("../Service/service.model");
const unlinkFile = require("../../../util/unlinkFile");
const mongoose = require("mongoose");

exports.updateSalon=async(user, payload)=>{
    const { gallery, profileImage, ...othersPayload} = payload;
    const isExistSalon = await User.findById({_id: user?._id});
    if(!isExistSalon){
        throw new ApiError(StatusCodes.NOT_FOUND, "No Salon Found");
    }

    if(gallery){
        gallery?.map((image, index)=>{
            isExistSalon.gallery.push(image);
        })
        await isExistSalon.save();
    }

    if(profileImage && isExistSalon?.profileImage?.startsWith("https")){
        othersPayload.profileImage = profileImage;
    }

    if(profileImage){s
        othersPayload.profileImage = profileImage;
        unlinkFile(isExistSalon?.profileImage)
    }

    const salon = await User.findByIdAndUpdate({_id: isExistSalon._id}, othersPayload, {new: true})
    return salon;
}

exports.getFeaturedSalon=async()=>{
    const salons = await User.find({featured: true}).select("_id profileImage featured rating totalRating location name");
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
    // salon list
    const salon = await User.findOne({_id: id}).select("_id name email profileImage phone location openingTimes openingDays description rating totalRating gallery");

    // all review for salon
    const reviews = await Review.find({salon: id}).populate({path: 'user', select: "name profileImage"}).select("_id comment createdAt");

    // all category
    const category= await Category.find({}).select("_id name image");
    if(!salon){
        throw new ApiError(StatusCodes.NOT_FOUND, "User doesn't exists")
    }

    return {
        salon,
        category,
        reviews
    };
}

exports.salonsFromDB = async (queries, user) => {
    const { search, rating, gender, category } = queries;
    
    let queryConditions = [];
    
    // Search condition
    if (search) {
        const userIds = await Service.find({ serviceName: { $regex: search, $options: "i" } }).distinct("user");
        const searchCondition = {
            $or: [
                { location: { $regex: search, $options: "i" } },
                { _id: { $in: userIds } }
            ]
        };
        queryConditions.push(searchCondition);
    }
    
    // Gender condition
    if (gender) {
        const genderCondition = {
            _id: { $in: await Service.find({ gender: gender }).distinct("user") }
        };
        queryConditions.push(genderCondition);
    }
    
    // Category condition
    if (category) {
        const categoryCondition = {
            _id: { $in: await Service.find({ category: category }).distinct("user") }
        };
        queryConditions.push(categoryCondition);
    }
    
    // Rating condition
    if (rating) {
        const ratingCondition = {
            rating: { $gte: 0, $lte: Number(rating) }
        };
        queryConditions.push(ratingCondition);
    }
    
    // Combine conditions
    const query = queryConditions.length > 0 ? { $and: queryConditions } : {};
    const result = await User.find(query).select("_id name profileImage rating location");

    // all wishlist
    const userId = new mongoose.Types.ObjectId(user._id);
    const wishList = await Wishlist.find({ user: userId })
        .populate({
            path: 'salon',
            select: "_id name profileImage location rating totalRating"
        })
        .select("_id salon");
    const salonIds = wishList.map((item) => item.salon._id.toString());

    // Add featured property to each salon if it matches a salon in the wishlist
    const salons = result.map((item) => {
        const salon = item.toObject();
        const isFeatured = salonIds.includes(salon._id.toString());
        return { ...salon, featured: isFeatured };
    });

    return salons;
};
