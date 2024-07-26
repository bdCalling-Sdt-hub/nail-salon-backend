const express =require("express")
const router = express.Router();
const ServiceController = require("./service.controller");
const auth = require("../../middlewares/auth");
const { USER_ROLE } = require("../../../enums");
const configureFileUpload = require("../../middlewares/fileHandler");

router.post("/", auth(USER_ROLE.SALON), configureFileUpload(), ServiceController.createService)
router.patch("/:id", auth(USER_ROLE.SALON),  configureFileUpload(), ServiceController.updateServiceFromDB)
router.delete("/delete-service/:id", auth(USER_ROLE.SALON), ServiceController.deleteServiceFromDB)
router.get("/:category", auth(USER_ROLE.SALON, USER_ROLE.USER), ServiceController.getServiceByCategoryFromDB)

module.exports = router;