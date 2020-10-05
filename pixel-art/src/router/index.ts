import { createRouter, createWebHashHistory } from "vue-router";

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
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
