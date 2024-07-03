const express = require("express");
const router = express.Router();
const MessageController = require("../message/message.controller");

router.post("/", MessageController.sendMessage)
router.get("/:id", MessageController.getMessage)

module.exports = router;