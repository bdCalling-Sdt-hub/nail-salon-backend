const express = require("express");
const UserRoutes =require("../src/user/user.routes");
const AuthRoutes =require("../src/auth/auth.routes");
const BannerRoutes =require("../app/modules/banner/banner.routes");
const BannerRoutes =require("../app/modules/category/category.routes");
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
        route: BannerRoutes
    }
]

appRouteList.forEach((route) => router.use(route.path, route.route));
module.exports = router;