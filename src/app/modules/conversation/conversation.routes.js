const express = require("express");
const router= express.Router();
const ConversationController = require("./conversation.controller");
const auth = require("../../middlewares/auth");
const { USER_ROLE } = require("../../../enums");

router.post("/:id", auth(USER_ROLE.USER), ConversationController.createConversation);
router.get("/", auth(USER_ROLE.USER, USER_ROLE.SALON), ConversationController.getConversation);

module.exports = router