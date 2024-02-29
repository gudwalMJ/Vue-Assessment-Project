<template>
  <div class="house-details-page">
    <div class="house-details">
      <a href="/" class="back-to-overview">Back to overview</a>

      <div class="house-image-container">
        <img :src="house?.image || placeholderImage" alt="House image" />
      </div>

      <div class="house-content">
        <h2>
          {{ house?.location?.street }} {{ house?.location?.houseNumber }}
        </h2>
        <div class="house-meta">
          <span class="price">€ {{ house?.price }}</span>
          <span class="size">{{ house?.size }} m²</span>
          <span class="year">Built in {{ house?.constructionYear }}</span>
        </div>
        <div class="house-description">
          {{ house?.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Imports
import apiService from "@/api/apiService";
import placeholderImage from "@/assets/img_placeholder_house@3x.png";

export default {
  data() {
    return {
      house: {
        image: "", // Assuming a string path or URL
        location: {
          street: "",
          zip: "",
          city: "",
        },
        description: "",
        rooms: {
          bedrooms: 0,
          bathrooms: 0,
        },
        size: 0, // Assuming size is a numeric value for square meters
        constructionYear: "", // Assuming a string or number
        hasGarage: false, // Assuming a boolean
      },
      placeholderImage,
    };
  },
  created() {
    this.fetchHouseDetails();
  },
  methods: {
    fetchHouseDetails() {
      const houseId = this.$route.params.id;
      apiService
        .getHouseById(houseId)
        .then((response) => {
          if (response.data && response.data.length > 0) {
            console.log("Received house data:", response.data[0]); // Log the first house object
            this.house = response.data[0]; // Use the first object from the array
          } else {
            console.error("House data is empty");
            // Handle the case where the house data is empty or not what you expect
            // You might want to set `house` back to its default state or show an error message
          }
        })
        .catch((error) => {
          console.error("Error fetching house details:", error);
        });
    },
  },
};
</script>

<style scoped>
.house-details-page {
  padding-top: 100px;
  background-color: #f6f6f6;
  min-height: 100vh;
  font-family: "Montserrat", sans-serif;
}
.house-details {
  max-width: 800px;
  margin: 2rem auto;
  font-family: "Arial", sans-serif;
}

.back-to-overview {
  display: inline-block;
  margin-bottom: 1rem;
  color: #333;
  text-decoration: none;
  font-size: 0.9rem;
}

.house-image-container {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.house-image-container img {
  width: 100%;
  height: auto;
  display: block;
}

.house-content {
  padding: 1rem;
  background: white;
  border: 1px solid #ddd;
  margin-top: -1px; /* To overlap the image box-shadow */
}

.house-content h2 {
  margin-top: 0;
  font-size: 22px;
  font-weight: bold;
  font-family: "Montserrat", sans-serif;
}

.house-meta {
  display: flex;
  align-items: center;
  margin: 1rem 0;
  font-size: 0.9rem;
}

.house-meta span {
  margin-right: 2rem;
  display: inline-block;
  background: #f3f3f3;
  padding: 0.5rem 1rem;
  border-radius: 15px;
}

.price {
  font-weight: bold;
  color: #e63946;
}

.year {
  color: #333;
}

.house-description {
  color: #333;
  line-height: 1.6;
}
</style>
