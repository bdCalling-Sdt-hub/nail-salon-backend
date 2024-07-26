const {Schema, model} = require("mongoose")

const bankSchema = new Schema(
    {
        bankName: {
            type: String,
            default: "",
            required: true
        },
        branchCode: {
            type: String,
            default: "",
            required: true
        },
        bankAccountNumber: {
            type: String,
            default: "",
            required: true
        },
        accountHolderName: {
            type: String,
            default: "",
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    },
    {timestamps: true}
)

const Bank = model("Bank", bankSchema);
module.exports = Bank;