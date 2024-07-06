const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth.js");
const { USER_ROLE } = require("../../../enums");
const UserController = require("./user.controller.js");


router.get("/user-list", auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), UserController.getUserList);

module.exports = router;