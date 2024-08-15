const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const { USER_ROLE } = require("../../../enums");
const PaymentController = require("./payment.controller");
const configureFileUpload = require("../../middlewares/fileHandler");

router.post("/create-account", auth(USER_ROLE.SALON), configureFileUpload(), PaymentController.createConnectedAccount);
router.patch("/transfer-payouts/:id", auth(USER_ROLE.USER), PaymentController.transferAndPayouts);

module.exports = router;