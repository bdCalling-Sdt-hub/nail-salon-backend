const express = require("express");
const auth = require("../../middlewares/auth");
const { USER_ROLE } = require("../../../enums");
const configureFileUpload = require("../../middlewares/fileHandler");
const NotificationController = require("./notification.controller");
const router = express.Router();

exports.module= router;