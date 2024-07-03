const express=require("express");
const WishlistController=require("./wishlist.controller")
const router = express.Router();

router.post("/", WishlistController.addToWishlist);
router.get("/service", WishlistController.getServicesFromWishlist);
module.exports=router;