import { createRouter, createWebHistory } from "vue-router";
import Houses from "../views/HousesView.vue";

const routes = [
  {
    path: "/",
    name: "Houses",
    component: Houses,
  },
  // other routes
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
