const express = require("express");
const UserRoutes =require("../src/user/user.routes");
const AuthRoutes =require("../src/auth/auth.routes");
const BannerRoutes =require("../src/app/modules/banner/banner.routes");
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
    }
]

appRouteList.forEach((route) => router.use(route.path, route.route));
module.exports = router;