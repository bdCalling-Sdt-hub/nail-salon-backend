const ApiError = require("../../../errors/ApiError");
const bcrypt = require("bcrypt");
const generateOTP = require("../../../util/generateOTP");
const sendMail = require("../../../helper/emailHelper");
const User = require("../user/user.model");
const { StatusCodes } = require("http-status-codes");
const config = require("../../../config");
const { emailVerification } = require("../../../shared/emailTemplate");

exports.createUserToDB = async(payload)=>{

    const {email, password, confirmPassword, name} = payload;
    
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

    const createUser= await User.create(data);

    if(!createUser){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create User");
    }

    const emailData = emailVerification({email: email, otp: newOtp, name: name})
    
    sendMail(emailData);

    // Schedule the task to set oneTImeCode to null after 3 minutes;
    setTimeout(async()=>{
        await User.updateOne(
            {_id: createUser._id}, 
            {$set: {oneTimeCode: null}}
        );

    }, 3 * 60 * 1000)  // 3 minutes in milliseconds

    setTimeout(async()=>{
        if(!createUser.verified){
            await User.findByIdAndDelete(createUser._id)
        }
    }, 10 *60 * 1000) // 10 minutes in milliseconds
}

exports.login = async(payload)=>{
    const { email, password } = payload;
    
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not Found");
    }

    if (!user.verified) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Your email is not verified");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Your credential doesn't match");
    }
    const token = jwt.sign({ _id: user._id, role: user.role },config.jwt.secret,{expiresIn: config.jwt.expire_in});

    return token;
}


exports.verifyEmail = async(payload)=>{
    const { email, oneTimeCode } = payload;
    
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not Found");
    }

    if (user.oneTimeCode !== oneTimeCode) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "OTP Don't matched");
    }

    //verified true here
    const updateData = {
        verified: true,
        oneTimeCode: null,
    };

    await User.findOneAndUpdate({ _id: isUserExist._id }, updateData, {new: true}).select(["-_id"]);
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
  
    // Prepare email for password reset
    const emailData = {
      email,
      subject: "Password Reset Email",
      html: `
          <h1>Hello, ${user.name}</h1>
          <p>Your Email verified Code is <h3>${oneTimeCode}</h3> to reset your password</p>
          <small>This Code is valid for 3 minutes</small>
        `,
    };

    // Send email
    try {
      await emailWithNodemailer(emailData);
    } catch (emailError) {
      console.error("Failed to send verification email", emailError);
    }
  
    // Set a timeout to update the oneTimeCode to null after 1 minute
    setTimeout(async () => {
      try {
        user.emailVerifyCode = null;
        await user.save();
        console.log("emailVerifyCode reset to null after 3 minute");
      } catch (error) {
        console.error("Error updating EmailVerifyCode:", error);
      }
    }, 180000); // 3 minute in milliseconds
}

exports.resetPassword = async (payload) => {
    const { email, password, confirmPassword } = payload;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User doesn't exists");
    }
  
    if (password !== confirmPassword) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Password and confirm password does not match");
    }
  
    if (user.oneTimeCode === true) {
        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(password, salt);
        user.password = hashPassword;
        user.oneTimeCode = null;
        await user.save();
    }

    return;
};

exports.changePassword = async (payload) => {
    const { currentPass, newPass, confirmPass } = payload;

    const user = await User.findById(req.user._id);

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

    await User.findByIdAndUpdate(user._id, {
        $set: { password: hashPassword },
    });

    return;
};

exports.updateProfile = async (user, payload) => {
    const {email} = payload;
    const isExistUser = await User.findById(user._id);
    if (!isExistUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }

    const isExistEmail = await User.findOne({email});
    if (!isExistEmail) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Email Already Taken");
      }

    const result = await User.findByIdAndUpdate(
        { _id: user._id },
        payload,
        { new: true }
    )
    return result
};

exports.getProfileFromDB = async (user) => {

    const isExistUser = await User.findById(user._id);
    if (!isExistUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User doesn't exits");
    }

    return isExistUser;
};

exports.deleteProfileFromDB = async (id) => {

    const isExistUser = await User.findById(id);
    if (!isExistUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User doesn't exits");
    }
    await User.findByIdAndUpdate({_id: id}, {verified: false}, {new: true})
    return;
};