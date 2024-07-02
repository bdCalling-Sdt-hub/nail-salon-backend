const { StatusCodes } = require('http-status-codes')
const ApiError =require('../../../errors/ApiError')
const Rule = require('./rule.model')

//privacy policy
exports.createPrivacyPolicyToDB = async (payload) => {
    const isExistPrivacy = await Rule.findOne({ type: 'privacy' })
    if (isExistPrivacy) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Privacy policy already exist!')
    } else {
        const result = await Rule.create({ ...payload, type: 'privacy' })
        return result
    }
}

exports.getPrivacyPolicyFromDB = async () => {
    const result = await Rule.findOne({ type: 'privacy' })
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Privacy policy doesn't exist!")
    }
    return result
}
exports.updatePrivacyPolicyToDB = async (payload) => {
    const isExistPrivacy = await Rule.findOne({ type: 'privacy' })
    if (!isExistPrivacy) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Privacy policy doesn't exist!")
    }
    const result = await Rule.findOneAndUpdate({ type: 'privacy' }, payload, {
        new: true,
    })
    return result
}

//terms and conditions
exports.createTermsAndConditionToDB = async (payload) => {
    const isExistTerms = await Rule.findOne({ type: 'terms' })
    if (isExistTerms) {
        throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Terms and conditions already exist!',
        )
    } else {
        const result = await Rule.create({ ...payload, type: 'terms' })
        return result
    }
}

exports.getTermsAndConditionFromDB = async () => {
    const result = await Rule.findOne({ type: 'terms' })
    if (!result) {
        throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Terms and conditions doesn't  exist!",
        )
    }
    return result
}

exports.updateTermsAndConditionToDB = async (payload) => {
    const isExistTerms = await Rule.findOne({ type: 'terms' })
    if (!isExistTerms) {
        throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Terms and conditions doesn't  exist!",
        )
    }
    const result = await Rule.findOneAndUpdate({ type: 'terms' }, payload, {
        new: true,
    })
    return result
}

//privacy policy
exports.createAboutToDB = async (payload) => {
    const isExistAbout = await Rule.findOne({ type: 'about' })
    if (isExistAbout) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'About already exist!')
    } else {
        const result = await Rule.create({ ...payload, type: 'about' })
        return result
    }
}

exports.getAboutFromDB = async () => {
    const result = await Rule.findOne({ type: 'about' })
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "About doesn't exist!")
    }
    return result;
}

exports.updateAboutToDB = async (payload) => {
    const isExistPrivacy = await Rule.findOne({ type: 'about' })
    if (!isExistPrivacy) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "About doesn't exist!")
    }
    const result = await Rule.findOneAndUpdate({ type: 'about' }, payload, {
        new: true,
    })
    return result;
}
