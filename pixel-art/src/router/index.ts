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
      import(/* webpackChunkName: "Login" */ "../views/Login.vue")
  },
  {
    path: "/draw",
    name: "EntryDrawPixelDetail",
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
    path: "/register",
    name: "Register",
    component: () =>
      import(/* webpackChunkName: "Register" */ "../views/Register.vue")
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () =>
      import(/* webpackChunkName: "Dashboard" */ "../views/Dashboard.vue"),
    children: [
      {
        path: "",
        component: () =>
          import(
            /* webpackChunkName: "Project" */ "../views/Dashboard/Project.vue"
          )
      },
      {
        path: "project",
        name: "Project",
        component: () =>
          import(
            /* webpackChunkName: "Project" */ "../views/Dashboard/Project.vue"
          )
      }
    ],
    redirect: { path: "/dashboard" }
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
