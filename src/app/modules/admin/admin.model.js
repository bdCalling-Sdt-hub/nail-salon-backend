const {model, Schema} = require("mongoose");

const adminSchema = new Schema(
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
            required: true
        },
        verified: {
            type: Boolean,
            required: true
        },
        oneTimeCode: {
            type: String,
            default: null
        },
        location: {
            type: String,
            required: false
        },
        profileImage: {
            type: String,
            default: "https://www.silive.com/resizer/v2/2UEJA4UKUFGEVEI5ATP2DF7PME.jpg?auth=2b1f6a00f8bc5aafb760bd6f3a36d62b12ba1e78386fc7adb7009ae50068f733&width=1280&quality=90"
        },
        role: {
            type: String,
            enum: ["SUPER_ADMIN", "ADMIN"],
            default: "ADMIN",
            required: true
        }
    },
    {timestamps: true}
);

const Admin = model("Admin", adminSchema);
module.exports = Admin;
