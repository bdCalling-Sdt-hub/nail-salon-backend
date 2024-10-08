const {model, Schema} = require("mongoose");

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: false
        },
        password: {
            type: String,
            required: false
        },
        appId: {
            type: String,
            required: false,
            trim: true,
            unique: true,
        },
        phone: {
            type: String,
            default: "",
            required: false
        },
        verified: {
            type: Boolean,
            required: false
        },
        location: {
            type: String,
            default: "",
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
        accountInformation: {
            status: {
              type: Boolean,
              default: false,
            },
            stripeAccountId: {
              type: String,
            },
            externalAccountId: {
              type: String,
            },
            currency: {
              type: String,
            }
        },
        openingTimes: {
            type: String,
            default: "",
            required: false
        },
        bank_account: {
            type: String,
            default: "",
            required: false
        },
        openingDays: {
            type: String,
            default: "",
            required: false
        },
        description: {
            type: String,
            default: "",
            required: false
        },
        contact: {
            type: String,
            default: "",
            required: false
        },
        featured: {
            type: Boolean,
            default: false,
            required: false
        },
        wish: {
            type: Boolean,
            default: false,
            required: false
        },
        rating: {
            type: Number,
            default: 0
        },
        totalRating: {
            type: Number,
            default: 0
        },
        gallery: [
            {
                type: String,
                require: true
            }
        ],
        role: {
            type: String,
            enum: ["SUPER_ADMIN", "ADMIN", "USER", "SALON"],
            default: "USER"
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

const User = model("User", userSchema);
module.exports = User;
