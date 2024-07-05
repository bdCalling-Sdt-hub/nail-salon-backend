const { model, Schema } = require("mongoose");

const serviceSchema= new Schema(
    {
        serviceName: {
            type: String,
            required: true
        },
        price: {
            type: String,
            required: true
        },
        category:{
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        gender: {
            type: String,
            enum: ["Male", "Female"],
            required: false
        },
        salon: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {timestamps: true}
)

const Service = model("Service", serviceSchema);
module.exports=Service;