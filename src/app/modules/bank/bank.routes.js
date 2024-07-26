const express = require("express");
const BankController = require("./bank.controller.js");
const configureFileUpload = require("../../../app/middlewares/fileHandler");
const auth = require("../../middlewares/auth.js");
const { USER_ROLE } = require("../../../enums");
const router = express.Router();

router.post("/create-bank", auth(USER_ROLE.SALON), configureFileUpload(), BankController.createBank);
router.patch("/update-bank", auth(USER_ROLE.SALON), configureFileUpload(), BankController.updateBank);
module.exports = router;