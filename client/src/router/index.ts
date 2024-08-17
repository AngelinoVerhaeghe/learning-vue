import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/add-post",
      name: "add_post",
      component: () => import("../views/AddPostView.vue"),
    },
    {
      path: "/edit-post/:slug",
      name: "edit_post",
      component: () => import("../views/EditPostView.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/post/:slug",
      name: "post",
      component: () => import("../views/PostView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/auth/LoginView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/auth/RegisterView.vue"),
    },
  ],
});

export default router;
