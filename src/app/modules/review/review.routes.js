const express =require("express")
const router = express.Router();
const auth = require("../../middlewares/auth");
const { USER_ROLE } = require("../../../enums");
const ReviewController = require("./review.controller");
const configureFileUpload = require("../../middlewares/fileHandler");


router.post("/", auth(USER_ROLE.USER), configureFileUpload(), ReviewController.createReview);
router.get("/:id", auth(USER_ROLE.USER), configureFileUpload(), ReviewController.getReview);


module.exports = router;