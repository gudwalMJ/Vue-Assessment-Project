import { createRouter, createWebHistory } from "vue-router";
import Houses from "../views/HousesView.vue";
import HouseDetails from "../views/HouseDetails.vue";

const routes = [
  {
    path: "/",
    name: "Houses",
    component: Houses,
  },
  {
    path: "/house/:id", // :id is a dynamic segment
    name: "HouseDetails",
    component: HouseDetails,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
