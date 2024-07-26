const {StatusCodes} = require("http-status-codes");
const ApiError = require("../../../errors/ApiError");
const Bank = require("./bank.model");
const User = require("../user/user.model");
const { default: mongoose } = require("mongoose");

exports.createBank = async(id, payload) => {
    const isExistUser = await User.findById(id);
    if (!isExistUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No User Found");
    }

    const createBank = await Bank.create(payload);
    if(createBank?._id){
        isExistUser.bank = createBank?._id;
        await isExistUser.save();
    }

    if (!createBank) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created banner");
    }
    return createBank;
    
};

exports.updateBank = async(id, payload) => {
    const isExistUser = await User.findById(id);
    if (!isExistUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No User Found");
    }

    const result = await Bank.findByIdAndUpdate({_id: new mongoose.Types.ObjectId(isExistUser?.bank)},  payload, {new: true});
    return result;
    
};