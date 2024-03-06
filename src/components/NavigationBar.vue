<template>
  <!-- Navigation bar -->
  <nav class="navbar">
    <div class="container">
      <!-- Brand/logo area -->
      <div class="navbar-brand">
        <img
          src="@/assets/img_logo_dtt@3x.png"
          alt="Logo"
          class="navbar-logo"
        />
      </div>
      <!-- Navigation menu -->
      <div class="navbar-menu">
        <!-- Navigation item for Houses page -->
        <router-link
          to="/"
          class="navbar-item"
          :class="{ 'is-active': activePage === 'Houses' }"
        >
          <img
            v-if="isMobile"
            :src="activePage === 'Houses' ? housesIconActive : housesIcon"
            alt="Houses"
          />
          <span v-else>Houses</span>
        </router-link>

        <!-- Navigation item for About page -->
        <router-link
          to="/about"
          class="navbar-item"
          :class="{ 'is-active': activePage === 'About' }"
        >
          <img
            v-if="isMobile"
            :src="activePage === 'About' ? aboutIconActive : aboutIcon"
            alt="About"
          />
          <span v-else>About</span></router-link
        >
      </div>
    </div>
  </nav>
</template>

<script>
import aboutIcon from "@/assets/ic_mobile_navigarion_info@3x.png";
import aboutIconActive from "@/assets/ic_mobile_navigarion_info_active@3x.png";
import housesIcon from "@/assets/ic_mobile_navigarion_home@3x.png";
import housesIconActive from "@/assets/ic_mobile_navigarion_home_active@3x.png";

export default {
  data() {
    return {
      activePage: "Houses", // Current active page for styling active navbar item
      isMobile: false,
      aboutIcon,
      aboutIconActive,
      housesIcon,
      housesIconActive,
    };
  },
  created() {
    this.checkIfMobile();
    window.addEventListener("resize", this.checkIfMobile);
  },
  beforeUnmount() {
    // Updated from beforeDestroy to beforeUnmount
    window.removeEventListener("resize", this.checkIfMobile);
  },
  methods: {
    checkIfMobile() {
      this.isMobile = window.innerWidth <= 414;
    },
  },
  watch: {
    $route(to) {
      this.activePage = to.name; // Update activePage based on route name
    },
  },
};
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px 0;
}
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 300px;
  padding: 0 240px;
}
.navbar-logo {
  height: 40px;
  margin-right: 60px;
  margin-left: 35%;
}
.navbar-brand {
  display: flex;
  align-items: center;
  justify-content: center;
}
.navbar-menu {
  display: flex;
  align-items: center;
}
.navbar-item {
  text-decoration: none;
  color: #c3c3c3;
  margin: 0 25px;
  padding: 5px 0;
  font-weight: 500;
  transition: color 0.2s ease-in-out;
}
.navbar-item:hover,
.navbar-item:active {
  color: black;
}
.is-active {
  color: black; /* Active item color */
  font-weight: bold;
}

/* Media query for devices with width up to 414px */
@media (max-width: 414px) {
  html,
  body {
    margin: 0;
    padding: 0;
    min-height: 100%; /* Ensure the full height is utilized */
    position: relative;
  }
  .navbar {
    position: fixed;
    top: auto; /* Remove the top positioning */
    bottom: 0; /* Position navbar at the bottom */
    padding: 5px 0; /* Adjust padding for smaller screens */
    z-index: 1000;
    height: 50px;
  }
  .container {
    flex-direction: row; /* Override if needed */
    justify-content: center; /* Center the content */
    padding: 0 10px; /* Adjust container padding if necessary */
    max-width: 100%; /* Use full width */
  }
  .navbar-brand,
  .navbar-menu {
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .navbar-item img {
    width: 24px; /* Resize icons */
    height: auto;
    margin-right: 10px; /* Adjust spacing between icon and text */
    margin-top: 7px;
  }
  .navbar-logo {
    display: none;
  }
  .navbar-item {
    margin: 0 60px; /* Example adjustment for spacing between items */
    padding: 5px 10px;
  }
}
</style>
