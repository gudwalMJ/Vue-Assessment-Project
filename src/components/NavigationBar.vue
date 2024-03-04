<!-- NAVBAR -->
<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-brand">
        <img
          src="@/assets/img_logo_dtt@3x.png"
          alt="Logo"
          class="navbar-logo"
        />
      </div>
      <div class="navbar-menu">
        <router-link
          to="/"
          class="navbar-item"
          :class="{ 'is-active': activePage === 'Houses' }"
          >Houses</router-link
        >
        <router-link
          to="/about"
          class="navbar-item"
          :class="{ 'is-active': activePage === 'About' }"
          >About</router-link
        >
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      activePage: "Houses",
    };
  },
  watch: {
    $route(to) {
      this.activePage = to.name;
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
</style>
