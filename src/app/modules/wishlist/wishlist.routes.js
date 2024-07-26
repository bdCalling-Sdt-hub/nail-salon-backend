const express=require("express");
const WishlistController=require("./wishlist.controller")
const router = express.Router();
const auth = require("../../middlewares/auth.js");
const { USER_ROLE } = require("../../../enums");

router.get("/", auth(USER_ROLE.USER), WishlistController.getWishlistFromDB);
router.post("/:id", auth(USER_ROLE.USER), WishlistController.addToWishlist);
module.exports=router;