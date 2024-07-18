const {StatusCodes} = require("http-status-codes");
const ApiError = require("../../../errors/ApiError");
const Faq = require("./faq.model");

exports.createFaqToDB = async (payload) => {
    const createFaq = await Faq.create(payload)

    if (!createFaq) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to created faq!')
    }

    return createFaq
}
exports.getAllFaqToDB = async ()=> {
    const createFaq = await Faq.find()
    return createFaq
}

exports.updateFaqToDB = async (id, payload)=> {
    const faq = await Faq.findOneAndUpdate({ _id: id }, payload, { new: true })
    if (!faq) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Faq doesn't exist!")
    }

    return faq
}

exports.deleteFaqToDB = async (id) => {
    const faq = await Faq.findByIdAndDelete(id)

    if (!faq) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Faq doesn't exist!")
    }

    return faq
}