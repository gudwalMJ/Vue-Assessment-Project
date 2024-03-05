<template>
  <div class="about-page">
    <div class="content-container">
      <h1>About DTT Real Estate</h1>
      <p>
        This web app is designed to help users browse and manage listings for
        houses.
      </p>
      <h2>Design and Development</h2>
      <div class="design-and-development">
        <img :src="logoDTT" alt="DTT Logo" class="dtt-logo" />
        <div class="developer-info">
          <p>By Josip Milan</p>
          <p>
            <a href="https://www.d-tt.nl/" target="_blank" class="dtt-link"
              >www.d-tt.nl</a
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Imports
import logoDTT from "@/assets/img_logo_dtt@3x.png";
export default {
  name: "AboutPage",
  data() {
    return {
      logoDTT,
    };
  },
};
</script>

<style scoped>
.about-page {
  background-color: #f6f6f6;
}
.content-container {
  padding: 100px 20px;
  text-align: left;
  margin-left: 250px;
  min-height: 100vh;
}

.about-page h1 {
  font-size: 24px;
  color: #333;
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 20px;
}
.about-page h2 {
  font-size: 24px;
  color: #333;
  font-weight: bold;
  margin-bottom: -20px;
}

.about-page p {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 50px;
}

.design-and-development {
  display: flex;
  align-items: center;
  margin-top: 40px;
}

.dtt-logo {
  height: 50px;
  width: 150px; /* Adjust width as needed */
  margin-right: 20px;
}

.developer-info p {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
}

.dtt-link {
  color: #067bc2;
  text-decoration: none;
}

.dtt-link:hover {
  text-decoration: underline;
}
</style>
