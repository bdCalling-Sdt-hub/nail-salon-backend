const { model, Schema } = require("mongoose");

const serviceSchema= new Schema(
    {

    },
    {timestamps: true}
)

const Service = model("Service", serviceSchema);
module.exports=Service;