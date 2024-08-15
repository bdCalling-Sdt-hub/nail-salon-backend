const express = require("express");
const configureFileUpload = require("../../middlewares/fileHandler");
const router = express.Router();
const SalonController = require("./salon.controller.js")
const auth = require("../../middlewares/auth.js");
const { USER_ROLE } = require("../../../enums");

router.patch("/update", auth(USER_ROLE.SALON), configureFileUpload(), SalonController.updateSalon);
router.get("/featured-salon", auth(USER_ROLE.USER), SalonController.getFeaturedSalon);
router.patch("/make-featured/:id", auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), SalonController.makeFeaturedSalon);
router.get("/salon-list", auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), SalonController.salonListFromDB);
router.get("/salons", auth(USER_ROLE.USER), SalonController.salonsFromDB);
router.get("/salon-details/:id", auth(USER_ROLE.USER), SalonController.salonDetailsFromDB);
router.get("/salon-service/:id", auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), SalonController.salonServiceFromDB);
module.exports = router;