<!-- src/components/NavigationBar.vue -->
<template>
  <nav class="navbar">
    <div class="container">
      <router-link to="/" class="navbar-brand">
        <img
          src="@/assets/img_logo_dtt@3x.png"
          alt="Logo"
          class="navbar-logo"
        />Houses</router-link
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
  left: 0;
  width: 100%;
  background-color: #ffffff;
  padding: 10px;
}
.container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 220px;
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
.is-active {
  font-weight: bold;
}
</style>
