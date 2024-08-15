const express =require("express")
const router = express.Router();
const ServiceController = require("./service.controller");
const auth = require("../../middlewares/auth");
const { USER_ROLE } = require("../../../enums");
const configureFileUpload = require("../../middlewares/fileHandler");

router.post("/", auth(USER_ROLE.SALON), configureFileUpload(), ServiceController.createService)
router.delete("/delete-service/:id", auth(USER_ROLE.SALON), ServiceController.deleteServiceFromDB)
router.get("/:category", auth(USER_ROLE.SALON, USER_ROLE.USER), ServiceController.getServiceByCategoryFromDB)
router.get("/service-list/:category", auth(USER_ROLE.SALON), ServiceController.serviceListFromDB)
router.get("/service-category/:category", auth(USER_ROLE.USER), ServiceController.categoryServiceFromDB)
router.patch("/:id", auth(USER_ROLE.SALON),  configureFileUpload(), ServiceController.updateServiceFromDB)

module.exports = router;