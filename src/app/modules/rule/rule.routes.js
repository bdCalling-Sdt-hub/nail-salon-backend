const express=require('express')
// const { USER_TYPE } =require('../../../enums/user')
// const auth =require('../../middlewares/auth')
const RuleController  =require('./rule.controller');
const configureFileUpload = require('../../middlewares/fileHandler');
const router = express.Router()

//privacy policy
router.route('/privacy-policy')
    .post(
        RuleController.createPrivacyPolicy 
    )
    .patch(
        RuleController.updatePrivacyPolicy
    )
    .get(
        RuleController.getPrivacyPolicy
    )

//terms and conditions
router.route('/terms-and-conditions')
    .post(
        RuleController.createTermsAndCondition,
    )
    .patch(
        RuleController.updateTermsAndCondition,
    )
    .get(
        RuleController.getTermsAndCondition,
    )

//privacy policy
router.route('/about')
    .post(
        RuleController.createAbout,
    )
    .patch(
        RuleController.updateAbout,
    )
    .get(
        RuleController.getAbout,
    )
module.exports = router;