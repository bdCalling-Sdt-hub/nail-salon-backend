const express = require("express");
const configureFileUpload= require("../../middlewares/fileHandler");
const FaqController = require("./faq.controller.js");
const auth = require("../../middlewares/auth.js");
const { USER_ROLE } = require("../../../enums");
const router= express.Router();

// frequently ask question (faq);
router.post( "/create-faq", auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), configureFileUpload(), FaqController.createFaq);
router.route("/:id")
    .patch(
      auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), configureFileUpload(), FaqController.updateFaq)
    .delete(
      auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
      FaqController.deleteFaq
    );
  
router.get("/", FaqController.getAllFaq);
  
module.exports= router;