import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);


const routes = [{
    path: "/",
    component: () =>
        import ("@/views/computeAF"),
}, {
    path: "/computeLevel",
    component: () =>
        import ("@/views/computeLevel"),
}, {
    path: "/host",
    component: () =>
        import ("@/views/host"),
}, {
    path: "/index",
    component: () =>
        import ("@/views/index"),
}];

const router = new VueRouter({
    // mode: "history",
    base: process.env.BASE_URL,
    routes,
});

export default router;