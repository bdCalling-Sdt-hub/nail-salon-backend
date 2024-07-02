const { Schema, model } = require("mongoose");

const eventModel = new Schema({
    name: {
        type: String,
        require: true
    },
    colors: {
        type: [String],
        required: true
    },
    image: {
        type: String,
        require: true
    }
});
const Event = model("event", eventModel);
module.exports = Event;
