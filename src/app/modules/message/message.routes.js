const express = require("express");
const router = express.Router();
const MessageController = require("../message/message.controller");
const auth = require("../../middlewares/auth");
const { USER_ROLE } = require("../../../enums");

router.post("/", auth(USER_ROLE.USER, USER_ROLE.SALON), MessageController.sendMessage)
router.get("/:id", auth(USER_ROLE.USER, USER_ROLE.SALON), MessageController.getMessage)

module.exports = router;