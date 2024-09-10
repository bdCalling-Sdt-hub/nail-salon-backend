const express = require("express");
const ContactController = require("./contact.controller.js");
const auth = require("../../middlewares/auth.js");
const { USER_ROLE } = require("../../../enums/index.js");
const router = express.Router();

router.post("/", auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), ContactController.createContact);
router.get("/", ContactController.getContact);
router.patch("/:id", auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),  ContactController.updateContact);


module.exports = router;