const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../../../shared/catchAsync');
const sendResponse =require( '../../../shared/sendResponse')
const RuleService = require('./rule.service')

//privacy 
exports.createPrivacyPolicy = catchAsync(async (req, res) => {
    const { ...privacyData } = req.body;
    const result = await RuleService.createPrivacyPolicyToDB(privacyData)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Privacy policy created successfully',
        data: result,
    })
})

exports.getPrivacyPolicy = catchAsync(async (req, res) => {
    const result = await RuleService.getPrivacyPolicyFromDB()

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Privacy policy retrieved successfully',
        data: result,
    })
})

exports.updatePrivacyPolicy = catchAsync(async (req, res) => {
    const { ...privacyData } = req.body
    const result = await RuleService.updatePrivacyPolicyToDB(privacyData)

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Privacy policy updated successfully',
        data: result,
    })
})

//terms and conditions
exports.createTermsAndCondition = catchAsync(async (req, res) => {
    const { ...termsData } = req.body
    const result = await RuleService.createTermsAndConditionToDB(termsData)

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Terms and conditions created successfully',
        data: result
    })
  },
)

exports.getTermsAndCondition = catchAsync(async (req, res) => {
    const result = await RuleService.getTermsAndConditionFromDB()

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Terms and conditions retrieved successfully',
        data: result,
    })
})

exports.updateTermsAndCondition = catchAsync(async (req, res) => {
    const { ...termsData } = req.body
    const result = await RuleService.updateTermsAndConditionToDB(termsData)

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Terms and conditions updated successfully',
        data: result
    })
})

//about
exports.createAbout = catchAsync(async (req, res) => {
    const { ...aboutData } = req.body
    const result = await RuleService.createAboutToDB(aboutData)

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'About created successfully',
        data: result
    })
})

exports.getAbout = catchAsync(async (req, res) => {
    const result = await RuleService.getAboutFromDB()

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'About retrieved successfully',
        data: result
    })
})

exports.updateAbout = catchAsync(async (req, res) => {
    const { ...aboutData } = req.body
    const result = await RuleService.updateAboutToDB(aboutData)

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'About updated successfully',
        data: result
    })
});
