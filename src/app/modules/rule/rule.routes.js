const express=require('express')
const auth = require("../../middlewares/auth");
const { USER_ROLE } = require("../../../enums");
const RuleController  =require('./rule.controller');
const configureFileUpload = require('../../middlewares/fileHandler');
const router = express.Router()

//privacy policy
router.route('/privacy-policy')
    .post( auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), RuleController.createPrivacyPolicy 
    )
    .patch( auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), RuleController.updatePrivacyPolicy
    )
    .get(
        RuleController.getPrivacyPolicy
    )

//terms and conditions
router.route('/terms-and-conditions')
    .post( auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), RuleController.createTermsAndCondition,
    )
    .patch(auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), RuleController.updateTermsAndCondition,
    )
    .get(
        RuleController.getTermsAndCondition,
    )

//privacy policy
router.route('/about')
    .post( auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), RuleController.createAbout,
    )
    .patch(auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), RuleController.updateAbout,
    )
    .get(
        RuleController.getAbout,
    )
module.exports = router;