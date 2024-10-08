const ApiError = require("../../../errors/ApiError");
const bcrypt = require("bcrypt");
const generateOTP = require("../../../util/generateOTP");
const User = require("../user/user.model");
const { StatusCodes } = require("http-status-codes");
const config = require("../../../config");
const { emailVerification, forgetPassword } = require("../../../shared/emailTemplate");
const { createToken } = require("../../../helper/jwtHelper");
const unlinkFile= require("../../../util/unlinkFile");
const Salon = require("../salon/salon.model");
const EmailHelper = require("../../../helper/emailHelper");

exports.createUserToDB = async(payload)=>{

    const {email, password, confirmPassword, name, role} = payload;
    
    const isExistUser = await User.findOne({email});
    if(isExistUser){
        throw new ApiError(StatusCodes.BAD_REQUEST, "This Email already Exits" )
    }

    if(password !== confirmPassword){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Password and Confirm Password doesn't matched")
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    
    const otp = generateOTP();
    const newOtp = otp.toString();

    const data = {
        ...payload,
        password: hashPassword,
        oneTimeCode:newOtp
    }

    const emailData = emailVerification({email: email, otp: newOtp, name: name})
    EmailHelper.sendMail(emailData);

    const createUser= await User.create(data);
    if(!createUser){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create User");
    }

    // Schedule the task to set oneTimeCode to null after 3 minutes;
    setTimeout(async () => {
        await User.updateOne(
            { _id: createUser._id }, 
            { $set: { oneTimeCode: null } }
        );
    }, 3 * 60 * 1000);
    
}

exports.login = async(payload)=>{
    const { email, password, type, appId, role } = payload;

    if (type === "social") {
        let user = await User.findOne({ appId });
    
        if (!user) {
          user = await User.create({ appId, role });
        }
    
        const token = createToken( { _id: user._id, role: user.role }, config.jwt.secret, config.jwt.expire_in)
    
        return {
            token,
            role: user?.role,
            type : "social"
        };
    }

    
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not Found");
    }

    if (!user.verified) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Your email is not verified");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Your credential doesn't match");
    }
    const token = createToken( { _id: user._id, role: user.role }, config.jwt.secret, config.jwt.expire_in)

    return {
        token,
        role: user?.role,
        type : null
    };
}


exports.verifyEmail = async(payload)=>{
    const { email, oneTimeCode } = payload;
    
    const isUserExist = await User.findOne({ email: email });
    if (!isUserExist) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not Found");
    }
    
    if (isUserExist.oneTimeCode !== oneTimeCode) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "OTP Don't matched");
    }

    //verified true here
    const updateData = {
        verified: true,
        oneTimeCode: null,
    };

    await User.findOneAndUpdate({ _id: isUserExist._id }, updateData, {new: true}).select(["-_id"]);
    const token = createToken( { _id: isUserExist._id, role: isUserExist.role }, config.jwt.secret, config.jwt.expire_in)
    return token;
}

exports.forgotPassword = async (payload) => {
    const { email } = payload;
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User doesn't exists");
    }
  
    const otp = generateOTP();
    const newOtp = otp.toString();
  
    // Store the OTC and its expiration time in the database
    user.oneTimeCode = newOtp;
    user.verified = false;
    await user.save();
  

    const emailData = forgetPassword({email: email, otp: newOtp, name: user?.name})
    EmailHelper.sendMail(emailData);
    return;
}

exports.resetPassword = async (user, payload) => {
    const { password, confirmPassword } = payload;

    const isExitsUser = await User.findById(user?._id);
    if (!isExitsUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User doesn't exists");
    }
  
    if (password !== confirmPassword) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Password and confirm password does not match");
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    await User.findByIdAndUpdate({_id: user?._id }, { $set:{password: hashPassword, oneTimeCode: null}}, {new: true})
    return;
};

exports.changePassword = async (id, payload) => {
    const { currentPass, newPass, confirmPass } = payload;

    const user = await User.findById(id);

    const isMatch = await bcrypt.compare(currentPass, user.password);
    if (!isMatch) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Current Password is Wrong");
    }

    if (currentPass == newPass) {
        throw new ApiError(StatusCodes.NOT_FOUND, "New password cannot be the same as old password");
    }

    if (newPass !== confirmPass) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "password and confirm password doesn't match");
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPass, salt);

    await User.findByIdAndUpdate(
        {_id: id}, 
        { password: hashPassword },
        {new: true}
    );
    return;
};

exports.updateProfile = async (user, payload) => {
    const {email} = payload;
    
    const {profileImage, gallery, ...othersData} = payload;
    
    const isExistUser = await User.findById(user._id);
    if (!isExistUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }

    
    if(profileImage && isExistUser?.profileImage?.startsWith("https")){
        othersData.profileImage = profileImage;
    }
    
    if(profileImage){
        othersData.profileImage = profileImage;
        unlinkFile(isExistUser.profileImage)
    }

    if(gallery){
        othersData.gallery = [...isExistUser.gallery, ...gallery]
    }

    const isExistEmail = await User.findOne({email});
    if (email && email === isExistEmail.email) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Email Already Taken");
    }

    const result = await User.findByIdAndUpdate(
        { _id: user._id },
        { $set: othersData },
        { new: true }
    )
    return result
};

exports.updateGalleryToDB = async (user, payload) => {
    const { image } = payload;
    
    const isExistUser = await User.findById(user._id);
    if (!isExistUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    
    if(image){
        unlinkFile(image)
    }

    await User.updateOne(
        { _id: user._id },
        { $pull: { gallery: image } },
        { new: true }
    )
    return;
};


exports.getProfileFromDB = async (user) => {

    const isExistUser = await User.findById(user._id);
    if (!isExistUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User doesn't exits");
    }

    return isExistUser;
};

exports.deleteProfileFromDB = async (id, password) => {

    
    const isExistUser = await User.findById(id);
    if (!isExistUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User doesn't exits");
    }
    
    if(isExistUser?.appId){
        await User.findByIdAndDelete({_id: id})
        return;
    }
    

    const isMatch = await bcrypt.compare(password, isExistUser.password);
    if (!isMatch) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Your credential doesn't match");
    }

    await User.findByIdAndDelete({_id: id})
    return;
};