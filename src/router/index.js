import { createRouter, createWebHistory } from "vue-router";
import Houses from "../views/HousesView.vue";
import HouseDetails from "../views/HouseDetails.vue";
import NewListingForm from "../components/NewListingForm.vue";
import AboutPage from "../pages/AboutPage.vue";

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
    props: true,
  },
  {
    path: "/new-listing",
    name: "NewListingForm",
    component: NewListingForm,
  },
  {
    path: "/edit-listing/:id",
    name: "EditListingForm",
    component: () => import("../components/EditListingForm.vue"),
    props: true,
  },
  {
    path: "/about",
    name: "About",
    component: AboutPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
