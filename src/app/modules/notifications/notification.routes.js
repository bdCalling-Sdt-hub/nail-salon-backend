const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const { USER_ROLE } = require("../../../enums");
const NotificationController = require("./notification.controller");

router.get("/admin-notification", auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN ), NotificationController.adminNotifications);
router.get("/", auth(USER_ROLE.SALON, USER_ROLE.USER), NotificationController.notifications);
router.patch("/read-notification", auth(USER_ROLE.SALON, USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), NotificationController.readNotification);

module.exports = router;