import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
    mode: "history",
    routes: [
        {
            path: "/cars",
            alias: "/cars",
            name: "cars",
            component: () => import("../pages/CarContainer")
        },
        {
            path: "/cars/:id",
            name: "car-details",
            component: () => import("../views/Car/CarDetails")
        },
        {
            path: "/",
            alias: "/users",
            name: "users",
            component: () => import("../pages/UserContainer")
        },
        {
            path: "/users/:id",
            name: "user-details",
            component: () => import("../views/User/UserDetails")
        },
        {
            path: "/cars-availability",
            alias: "/cars-availability",
            name: "cars-availability",
            component: () => import("../pages/CarAvailabilityContainer")
        },
        {
            path: "/car-availability-details/:id",
            name: "car-availability-details",
            component: () => import("../views/CarAvailability/CarAvailabilityDetails")
        }
    ]
});