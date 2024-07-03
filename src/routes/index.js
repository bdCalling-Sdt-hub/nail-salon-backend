const express = require("express");
const UserRoutes =require("../app/modules/user/user.routes");
const AuthRoutes =require("../app/modules/auth/auth.routes");
const BannerRoutes =require("../app/modules/banner/banner.routes");
const CategoryRoutes =require("../app/modules/category/category.routes");
const RuleRoutes =require("../app/modules/rule/rule.routes");
const BookingRoutes =require("../app/modules/booking/booking.routes");
const WishlistRoutes =require("../app/modules/wishlist/wishlist.routes");
const ConversationRoutes =require("../app/modules/conversation/conversation.routes");
const MessageRoutes =require("../app/modules/message/message.routes");
const router = express.Router();

const appRouteList = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/banner",
        route: BannerRoutes
    },
    {
        path: "/category",
        route: CategoryRoutes
    },
    {
        path: "/rule",
        route: RuleRoutes
    },
    {
        path: "/booking",
        route: BookingRoutes
    },
    {
        path: "/wishlist",
        route: WishlistRoutes
    },
    {
        path: "/conversation",
        route: ConversationRoutes
    },
    {
        path: "/message",
        route: MessageRoutes
    }
]

appRouteList.forEach((route) => router.use(route.path, route.route));
module.exports = router;