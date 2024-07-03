const express = require("express");
const router= express.Router();
const ConversationController = require("./conversation.controller");

router.post("/", ConversationController.createConversation);
router.get("/", ConversationController.getConversation);

module.exports = router