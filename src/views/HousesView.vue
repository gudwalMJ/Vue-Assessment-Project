<!-- src/views/HousesView.vue -->
<template>
  <div class="houses">
    <div v-for="house in houses" :key="house.id" class="house">
      <img
        :src="house.image || placeholderImage"
        alt="House image"
        class="house-image"
      />

      <div class="details">
        <p>
          {{
            `${house.location.street} ${house.location.houseNumber}${
              house.location.houseNumberAddition || ""
            }, € ${formatPrice(house.price)} ${house.location.zip} ${
              house.location.city
            }`
          }}
        </p>
        <p>
          <img :src="bedIcon" alt="Bedrooms" /> {{ house.rooms.bedrooms }}
          <img :src="bathIcon" alt="Bathrooms" /> {{ house.rooms.bathrooms }}
          <img :src="sizeIcon" alt="Size" /> {{ house.size }} m2
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from "@/api/apiService";
// Import the placeholder image for houses
import placeholderImage from "@/assets/img_placeholder_house@3x.png";
// Import the images/icons
import sizeIcon from "@/assets/ic_size@3x.png";
import bedIcon from "@/assets/ic_bed@3x.png";
import bathIcon from "@/assets/ic_bath@3x.png";

export default {
  data() {
    return {
      sizeIcon,
      bedIcon,
      bathIcon,
      placeholderImage,
      houses: [],
    };
  },
  created() {
    this.fetchHouses();
  },
  methods: {
    fetchHouses() {
      apiService
        .getHouses()
        .then((response) => {
          console.log(response.data); // Log the API response data
          this.houses = response.data;
        })
        .catch((error) => {
          console.error("Error fetching houses:", error);
        });
    },
    formatPrice(price) {
      // Example using 'de-DE' locale which typically uses dot as thousands separator
      return new Intl.NumberFormat("de-DE").format(price);
    },
  },
};
</script>

<style scoped>
.houses {
  margin-top: 70px; /* Adjust based on the height of your fixed header */
  background-color: #f6f6f6;
}
.house {
  /* Add styles for the house cards */
}
.house-image {
  max-width: 2000px; /* Adjust based on your design requirements */
  max-height: 200px;
  object-fit: cover; /* This ensures the image covers the area, preserving its aspect ratio */
}
.details img {
  width: 24px; /* Adjust as needed */
  height: 24px; /* Adjust as needed */
  vertical-align: middle; /* Aligns the icon with the text */
}
</style>
