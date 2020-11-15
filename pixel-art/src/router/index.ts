import {
  createRouter,
  createWebHashHistory,
  createWebHistory
} from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () =>
      import(/* webpackChunkName: "drawPixel" */ "../views/Draw.vue")
  },
  {
    path: "/draw/:id",
    name: "DrawPixelDetail",
    component: () =>
      import(/* webpackChunkName: "drawPixel" */ "../views/Draw.vue")
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "Login" */ "../views/Login.vue")
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: () => import(/* webpackChunkName: "404" */ "../views/404.vue")
  }
];

const router = createRouter({
  // history: createWebHashHistory(),
  history: createWebHistory(),
  routes
});

export default router;
