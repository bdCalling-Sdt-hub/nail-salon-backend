const express = require("express");
const configureFileUpload = require("../../middlewares/fileHandler");
const router = express.Router();
const SalonController = require("./salon.controller.js")
const auth = require("../../middlewares/auth.js");
const { USER_ROLE } = require("../../../enums");

router.patch("/update", auth(USER_ROLE.SALON), configureFileUpload(), SalonController.updateSalon);
module.exports = router;