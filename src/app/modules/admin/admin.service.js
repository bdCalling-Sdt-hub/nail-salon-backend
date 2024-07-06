const { StatusCodes } = require("http-status-codes");
const ApiError = require("../../../errors/ApiError");
const Admin = require("./admin.model");
const bcrypt = require("bcrypt");
const { createToken } = require("../../../helper/jwtHelper");
const config = require("../../../config");
const sendMail = require("../../../helper/emailHelper");
const User = require("../user/user.model");
const Booking = require("../booking/booking.model");

exports.makeAdmin=async(payload)=>{
    const {password, ...othersPayload} = payload;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if(hashPassword){
        othersPayload.password=hashPassword;
    }

    const result = await Admin.create(othersPayload);
    if(!result){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Create Admin");
    }

    return;
}

exports.adminLogin=async(payload)=>{
    const { email, password } = payload;
    
    const admin = await Admin.findOne({ email });
    if (!admin) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Admin not Found");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Your credential doesn't match");
    }
    const token = createToken( { _id: admin._id, role: admin.role }, config.jwt.secret, config.jwt.expire_in)

    return token;
}

exports.getAdmin=async()=>{
    return await Admin.find({role: "ADMIN"});
}

exports.deleteAdmin=async(id)=>{
    return await Admin.findByIdAndUpdate({_id: id});
}

exports.forgotPassword = async (payload) => {
    const { email } = payload;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Admin doesn't exist");
    }
  
    const otp = generateOTP();
    const newOtp = otp.toString();
  
    // Store the OTC and its expiration time in the database
    admin.oneTimeCode = newOtp;
    admin.verified = false;
    await admin.save();
  

    const emailData = forgetPassword({email: email, otp: newOtp, name: admin?.name})
    sendMail(emailData);
    return;
}

exports.verifyEmail = async(payload)=>{
    const { email, oneTimeCode } = payload;
    
    const isAdminExist = await Admin.findOne({ email: email });
    if (!isAdminExist) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Admin not Found");
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
}

exports.resetPassword = async (payload) => {
    const { email, password, confirmPassword } = payload;

    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Admin doesn't exists");
    }
  
    if (password !== confirmPassword) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Password and confirm password does not match");
    }
  
    if (admin.oneTimeCode === true) {
        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(password, salt);
        admin.password = hashPassword;
        admin.oneTimeCode = null;
        admin.verified = true;
        await admin.save();
    }

    return;
};

exports.changePassword = async (admin, payload) => {
    const { currentPass, newPass, confirmPass } = payload;

    const isExistAdmin = await Admin.findById(admin._id);

    const isMatch = await bcrypt.compare(currentPass, isExistAdmin.password);
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

    await Admin.findByIdAndUpdate(admin._id, {
        $set: { password: hashPassword },
    });

    return;
};

exports.updateProfile = async (admin, payload) => {
    const {email} = payload;
    
    const {profileImage, ...othersData} = payload;
    
    const isExistAdmin = await Admin.findById(admin._id);
    if (!isExistAdmin) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }

    if(profileImage && isExistAdmin?.profileImage?.startsWith("https")){
        othersData.profileImage = profileImage;
    }else{
        unlinkFile(isExistAdmin.profileImage)
        othersData.profileImage = profileImage;
    }

    const isExistEmail = await Admin.findOne({email});
    if (email && email === isExistEmail.email) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Email Already Taken");
    }

    const result = await Admin.findByIdAndUpdate(
        { _id: admin._id },
        { $set: othersData },
        { new: true }
    )
    return result
};


exports.getProfileFromDB = async (admin) => {

    const isExistAdmin = await Admin.findById(admin._id);
    if (!isExistAdmin) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Admin doesn't exits");
    }

    return isExistAdmin;
};

exports.getOverviewFromDB = async (year) => {
    const totalUser =await User.countDocuments({role: "USER"});
    const totalSalon =await  User.countDocuments({role: "SALON"});

    const totalIncome = await Booking.aggregate([
        { $group: { _id: null, totalIncomes: { $sum: "$price" } } },
    ]);

    //monthly sales calculate
    const currentYear = new Date().getFullYear();
    const userMonths = [
        { name: "Jan", totalUser: 0 },
        { name: "Feb", totalUser: 0 },
        { name: "Mar", totalUser: 0 },
        { name: "Apr", totalUser: 0 },
        { name: "May", totalUser: 0 },
        { name: "Jun", totalUser: 0 },
        { name: "Jul", totalUser: 0 },
        { name: "Aug", totalUser: 0 },
        { name: "Sep", totalUser: 0 },
        { name: "Oct", totalUser: 0 },
        { name: "Nov", totalUser: 0 },
        { name: "Dec", totalUser: 0 },
    ];

    const salonMonths = [
        { name: "Jan", totalUser: 0 },
        { name: "Feb", totalUser: 0 },
        { name: "Mar", totalUser: 0 },
        { name: "Apr", totalUser: 0 },
        { name: "May", totalUser: 0 },
        { name: "Jun", totalUser: 0 },
        { name: "Jul", totalUser: 0 },
        { name: "Aug", totalUser: 0 },
        { name: "Sep", totalUser: 0 },
        { name: "Oct", totalUser: 0 },
        { name: "Nov", totalUser: 0 },
        { name: "Dec", totalUser: 0 },
    ];

    const monthlyUser = await User.aggregate([
        { $match: { role: "USER" } },
        {
            $project: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" }
            }
        },
        { $match: { year: currentYear } },
        {
            $group: {
                _id: { year: "$year", month: "$month" },
                totalUsers: { $sum: 1 },
            }
        },
      
    ]);

    const monthlySalon = await User.aggregate([
        { $match: { role: "SALON" } },
        {
            $project: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" }
            }
        },
        { $match: { year: currentYear } },
        {
            $group: {
                _id: { year: "$year", month: "$month" },
                totalUsers: { $sum: 1 },
            }
        },
      
    ]);

    // Update the months array with the total user for each month
    monthlyUser.forEach((user) => {
        const monthIndex = user._id.month - 1;
        userMonths[monthIndex].totalUser = user.totalUsers;
    });
    
    // Update the months array with the total salon for each month
    monthlySalon.forEach((salon) => {
        const monthIndex = salon._id.month - 1;
        salonMonths[monthIndex].totalUser = salon.totalUsers;
    });

    return {
        totalUser,
        totalSalon,
        totalIncome: totalIncome[0]?.totalIncomes,
        userMonths,
        salonMonths,

    };
};


exports.getIncomeGrowthFromDB = async (year) => {

    const months = [
        { name: "Jan", totalIncome: 0 },
        { name: "Feb", totalIncome: 0 },
        { name: "Mar", totalIncome: 0 },
        { name: "Apr", totalIncome: 0 },
        { name: "May", totalIncome: 0 },
        { name: "Jun", totalIncome: 0 },
        { name: "Jul", totalIncome: 0 },
        { name: "Aug", totalIncome: 0 },
        { name: "Sep", totalIncome: 0 },
        { name: "Oct", totalIncome: 0 },
        { name: "Nov", totalIncome: 0 },
        { name: "Dec", totalIncome: 0 },
    ];

    const now = new Date();
    const currentYear = now.getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear + 1, 0, 1);

    const monthlyIncome = await Booking.aggregate([
        { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                },
                totalIncome: { $sum: '$price' },
            },
        }

    ]);

    monthlyIncome.forEach((income) => {
        const monthIndex = income._id.month - 1;
        months[monthIndex].totalIncome = income.totalIncome;
    });

    return months;
};