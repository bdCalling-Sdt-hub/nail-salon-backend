const express = require("express");
const configureFileUpload = require("../../middlewares/fileHandler");
const router = express.Router();
const SalonController = require("./salon.controller.js")
const auth = require("../../middlewares/auth.js");
const { USER_ROLE } = require("../../../enums");

router.patch("/update", auth(USER_ROLE.SALON), configureFileUpload(), SalonController.updateSalon);
router.get("/featured-salon", auth(USER_ROLE.USER), SalonController.getFeaturedSalon);
router.get("/make-featured/:id", auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), SalonController.makeFeaturedSalon);
router.get("/salon-list", auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), SalonController.salonListFromDB);
router.get("/salons", SalonController.salonsFromDB);
router.get("/salon-details/:id", auth(USER_ROLE.USER), SalonController.salonDetailsFromDB);
module.exports = router;