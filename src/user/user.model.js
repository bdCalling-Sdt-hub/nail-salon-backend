const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
      name: {
          type: String,
          required: true
      },
      email: {
          type: String,
          required: true
      },
      password: {
          type: String,
          required: true
      },
      phone: {
          type: String,
          required: false
      },
      verified: {
          type: Boolean,
          required: false
      },
      location: {
          type: String,
          required: false
      },
      oneTimeCode: {
          type: String,
          default: null
      },
      profileImage: {
          type: String,
          default: "https://www.silive.com/resizer/v2/2UEJA4UKUFGEVEI5ATP2DF7PME.jpg?auth=2b1f6a00f8bc5aafb760bd6f3a36d62b12ba1e78386fc7adb7009ae50068f733&width=1280&quality=90"
      },
      status: {
          type: String,
          enum: ["active", "inactive"],
          default: "active"
      },
      role: {
          type: String,
          enum: ["SUPER_ADMIN", "ADMIN", "USER", "SALON"],
          default: "USER",
          required: true
      }
  },
  {timestamps: true}
);

//user check
userSchema.statics.isExistUser = async (id) => {
  const isExistUser = await User.findById(id);
  return isExistUser;
};

//account check
userSchema.statics.isAccountCreated = async (id) => {
  const isUserExist = await User.findById(id);
  return isUserExist.accountInformation.status;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
