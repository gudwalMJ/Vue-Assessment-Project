<!-- src/components/NavigationBar.vue -->
<template>
  <nav class="navbar">
    <div class="container">
      <router-link to="/" class="navbar-brand">
        <img
          src="@/assets/img_logo_dtt@3x.png"
          alt="Logo"
          class="navbar-logo"
        />House Listings</router-link
      >
      <div class="navbar-menu">
        <router-link
          to="/"
          class="navbar-item"
          :class="{ 'is-active': activePage === 'Houses' }"
          >Houses</router-link
        >
        <!-- Place other navigation links here in the future! -->
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
};
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: #ffffff;
}
.container {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}
.navbar-logo {
  height: 40px;
  margin-right: 50px;
  margin-left: 35%;
}
.navbar-brand {
  display: flex;
  align-items: center;
}
.is-active {
  font-weight: bold;
}
</style>
