const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailWithNodemailer = require("../config/email.config");
const sendResponse = require("../shared/sendResponse");
const ApiError = require("../errors/ApiError");
const httpStatus = require("http-status");
const userTimers = new Map();
const fs = require("fs");
const path = require("path");
const pick = require("../shared/pick");
const paginationCalculate = require("../helper/paginationHelper");
const catchAsync = require("../shared/catchAsync");

//catch async
exports.userRegister = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPass,
    termAndCondition,
    role,
  } = req.body;

  if (
    !firstName &&
    !lastName &&
    !email &&
    !password &&
    !confirmPass &&
    !termAndCondition
  ) {
    throw new ApiError(400, "All Field are required");
  }

  const isExist = await User.findOne({ email: email });
  if (isExist) {
    throw new ApiError(409, "Email already exist!");
  }

  if (password !== confirmPass) {
    throw new ApiError(400, "Password and confirm password does not match");
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  let imageFileName = "";
  if (req.files && req.files.image && req.files.image[0]) {
    imageFileName = `/media/${req.files.image[0].filename}`;
  }

  const emailVerifyCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashPassword,
    termAndCondition: JSON.parse(termAndCondition),
    emailVerifyCode,
    role: role,
    image: !imageFileName
      ? "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg?size=626&ext=jpg&ga=GA1.1.1700460183.1708560000&semt=sph"
      : imageFileName,
  });

  if (userTimers.has(user?._id)) {
    clearTimeout(userTimers.get(user?._id));
  }
  const userTimer = setTimeout(async () => {
    try {
      user.oneTimeCode = null;
      await user.save();
      // Remove the timer reference from the map
      userTimers.delete(user?._id);
    } catch (error) {
      console.error(
        `Error updating email verify code for user ${user?._id}:`,
        error
      );
    }
  }, 180000); // 3 minutes in milliseconds

  // Store the timer reference in the map
  userTimers.set(user?._id, userTimer);

  const emailData = {
    email,
    subject: "Account Activation Email",
    html: `
                <h1>Hello, ${user?.firstName}</h1>
                <p>Your email verified code is <h3>${emailVerifyCode}</h3> to verify your email</p>
                <small>This Code is valid for 3 minutes</small>
              `,
  };

  emailWithNodemailer(emailData);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Register successfully! Please check your E-mail to verify.",
  });
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { emailVerifyCode, email } = req.body;
  console.log(emailVerifyCode, email);

  if (!emailVerifyCode && !email) {
    throw new ApiError(400, "All Field are required");
  }

  const user = await User.findOne({ email: email });
  console.log(user);
  if (!user) {
    throw new ApiError(404, "User Not Found");
  }

  if (user.emailVerifyCode !== emailVerifyCode) {
    throw new ApiError(410, "OTP Don't matched");
  }

  user.emailVerified = true;
  await user.save();
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Email Verified Successfully",
  });
});

exports.userLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!password && !email) {
    throw new ApiError(400, "All Field are required");
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    throw new ApiError(400, "User not Found");
  }

  if (!user.emailVerified) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "your email is not verified");
  }

  const ismatch = await bcrypt.compare(password, user.password);
  if (!ismatch) {
    throw new ApiError(401, "your credential doesn't match");
  }

  const token = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    }
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your Are logged in successfully",
    user: {
      role: user.role,
      id: user._id,
      interest: user.interest,
    },
    token: token,
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User doesn't exists");
  }

  // Generate OTC (One-Time Code)
  const emailVerifyCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

  // Store the OTC and its expiration time in the database
  user.emailVerifyCode = emailVerifyCode;
  user.emailVerified = false;
  await user.save();

  // Prepare email for password reset
  const emailData = {
    email,
    subject: "Password Reset Email",
    html: `
        <h1>Hello, ${user.firstName}</h1>
        <p>Your Email verified Code is <h3>${emailVerifyCode}</h3> to reset your password</p>
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

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Send email Verify Code Successfully",
  });
});

exports.otpVerify = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User doesn't exists");
  }

  // Store the OTC and its expiration time in the database
  if (user.emailVerifyCode == otp) {
    user.emailVerified = true;
    user.emailVerifyCode = null;
    await user.save();
  }

  const token = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    }
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP Verified Successfully",
    user: {
      role: user.role,
      id: user._id,
      interest: user.interest,
    },
    token: token,
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new ApiError(400, "User doesn't exists");
  }

  if (password !== confirmPassword) {
    throw new ApiError(400, "Password and confirm password does not match");
  }

  if (user.emailVerified === true) {
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);
    user.password = hashpassword;
    user.emailVerifyCode = null;
    await user.save();

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password Updated Successfully",
      data: user,
    });
  }
});

exports.changePassword = catchAsync(async (req, res) => {
  const { currentPass, newPass, confirmPass } = req.body;
  const user = await User.findById(req.user._id);

  if (!currentPass || !newPass || !confirmPass) {
    throw new ApiError(400, "All Fields are required");
  }

  const ismatch = await bcrypt.compare(currentPass, user.password);
  if (!ismatch) {
    throw new ApiError(400, "Current Password is Wrong");
  }

  if (currentPass == newPass) {
    throw new ApiError(400, "New password cannot be the same as old password");
  }

  if (newPass !== confirmPass) {
    throw new ApiError(400, "password and confirm password doesnt match");
  }

  const salt = await bcrypt.genSalt(10);
  const hashpassword = await bcrypt.hash(newPass, salt);

  await User.findByIdAndUpdate(req.user._id, {
    $set: { password: hashpassword },
  });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password Changed Successfully",
  });
});

//update profile
exports.updateProfile = catchAsync(async (req, res, next) => {
  if (req.fileValidationError) {
    res.status(400).json({ message: req.fileValidationError });
  }
  const isExistUser = await User.findById(req.user._id);
  if (!isExistUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User doesn't exist!");
  }
  const {
    firstName,
    lastName,
    email,
    mobileNumber,
    location,
    about,
    profession,
    color,
    instagram,
  } = req.body;

  let imageFileName;
  if (req.files && req.files.image && req.files.image[0]) {
    imageFileName = `/media/${req.files.image[0].filename}`;
  }

  //unlink file here
  const fileName = isExistUser?.image?.split("/").pop();
  const filePath = path.join(__dirname, "..", "uploads", "media", fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  isExistUser.firstName = firstName ? firstName : isExistUser.firstName;
  isExistUser.lastName = lastName ? lastName : isExistUser.lastName;
  isExistUser.instagramLink = instagram ? instagram : isExistUser.instagramLink;
  isExistUser.email = email ? email : isExistUser?.email;
  isExistUser.mobileNumber = mobileNumber
    ? mobileNumber
    : isExistUser.mobileNumber;
  isExistUser.location = location ? location : isExistUser.location;
  isExistUser.color = color ? color : isExistUser.color;
  isExistUser.about = about ? about : isExistUser.about;
  isExistUser.profession = profession ? profession : isExistUser.profession;
  isExistUser.image = imageFileName ? imageFileName : isExistUser.image;
  await isExistUser.save();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile Updated Successfully",
  });
});

//following and follower
exports.makeFollower = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const targetUser = await User.findById(id);
  if (!targetUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User doesn't exist!");
  }

  const currentUser = await User.findById(req.user._id);
  if (!currentUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User doesn't exist!");
  }

  if (currentUser._id.toString() === id.toString()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You can't follow yourself");
  }

  if (!targetUser.followers.includes(currentUser._id)) {
    targetUser.followers.push(currentUser._id);
    await targetUser.save();
  }

  if (!currentUser.following.includes(targetUser._id)) {
    currentUser.following.push(targetUser._id);
    await currentUser.save();
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Followed Successfully",
  });
});

exports.deleteAccount = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(204, "No User Found");
  }
  user.status = "DELETE";
  await user.save();
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Account Delete Successfully",
  });
});

exports.makeInterest = catchAsync(async (req, res, next) => {
  const { interest } = req.body;

  // Add interest to the user's interest array
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { interest: [...interest] },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, "User doesn't exist!");
  }

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Make interest Successfully",
    data: user,
  });
});

exports.getProfileFromDB = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate("followers")
    .populate("following");
  if (!user) {
    throw new ApiError(404, "Your are not a valid User");
  }

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrieve Data",
    user: user,
  });
});

exports.getProfileByIDFromDB = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id)
    .populate("followers")
    .populate("following");
  if (!user) {
    throw new ApiError(404, "Your are not a valid User");
  }

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrieve Data",
    user: user,
  });
});

exports.getTopArtistFromDB = catchAsync(async (req, res, next) => {
  const { interest } = await User.findById(req.user._id);
  const artists = await User.find({
    role: "ARTIST",
    interest: { $in: interest },
    "ratings.rate": { $gt: 0 },
  }).sort({ "ratings.rate": -1 });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrieve Data",
    data: artists,
  });
});

exports.getAllArtistFromDB = catchAsync(async (req, res, next) => {
  const paginationOptions = pick(req.query, ["limit", "page"]);
  const { limit, page, skip } = paginationCalculate(paginationOptions);

  const searchQuery = req.query.keyword;

  const query = {
    $or: [
      {
        name: {
          $regex: searchQuery,
          $options: "i",
        },
      },
      {
        email: {
          $regex: searchQuery,
          $options: "i",
        },
      },
    ],
  };

  const artists = await User.find({ role: "ARTIST", query })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments({ role: "ARTIST" });
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All gig retrieved successfully",
    pagination: {
      page,
      limit,
      total,
    },
    data: artists,
  });
});
