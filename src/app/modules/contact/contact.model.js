const mongoose = require("mongoose")

const contactSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        contact: {
            type: String,
            required: true
        }
    },
    {timestamps: true}
)

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;