const express = require("express");
const UserRoutes =require("../app/modules/user/user.routes");
const AuthRoutes =require("../app/modules/auth/auth.routes");
const BannerRoutes =require("../app/modules/banner/banner.routes");
const CategoryRoutes =require("../app/modules/category/category.routes");
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
    }
]

appRouteList.forEach((route) => router.use(route.path, route.route));
module.exports = router;