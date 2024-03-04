<template>
  <div class="house-details-page">
    <div class="house-details">
      <a href="/" class="back-to-overview"
        ><img :src="backIcon" alt="back" />Back to overview</a
      >

      <div class="house-image-container">
        <img :src="house?.image || placeholderImage" alt="House image" />
      </div>

      <div class="house-content">
        <h2>
          {{ house?.location?.street }} {{ house?.location?.houseNumber }}
          <span v-if="house?.location?.houseNumberAddition">
            {{ house?.location?.houseNumberAddition }}</span
          >
        </h2>
        <p class="postal-city">
          <img :src="locationIcon" alt="Location" /> {{ house?.location?.zip }}
          {{ house?.location?.city }}
        </p>
        <div class="house-meta">
          <span class="price"
            ><img :src="euroIcon" alt="Euros" /> {{ house?.price }}</span
          >
          <span class="size"
            ><img :src="sizeIcon" alt="Size" />{{ house?.size }} m²</span
          >
          <span class="year"
            ><img :src="constructionIcon" alt="Location" />Built in
            {{ house?.constructionYear }}</span
          >
        </div>
        <p class="house-icons">
          <img :src="bedIcon" alt="Bedrooms" /> {{ house?.rooms?.bedrooms }}
          <img :src="bathIcon" alt="Bathrooms" /> {{ house?.rooms?.bathrooms }}
          <img :src="garageIcon" alt="Garage" />
          {{ house?.hasGarage ? "Yes" : "No" }}
        </p>
        <div class="house-description">
          {{ house?.description }}
        </div>
        <div class="house-actions">
          <button @click="navigateToEditPage(house.id)" class="edit-button">
            Edit
          </button>
          <button @click="deleteListing(house.id)" class="delete-button">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Imports
import apiService from "@/api/apiService";
import placeholderImage from "@/assets/img_placeholder_house@3x.png";
// Import the images/icons
import backIcon from "@/assets/ic_back_grey@3x.png";
import garageIcon from "@/assets/ic_garage@3x.png";
import bedIcon from "@/assets/ic_bed@3x.png";
import bathIcon from "@/assets/ic_bath@3x.png";
import locationIcon from "@/assets/ic_location@3x.png";
import euroIcon from "@/assets/ic_price@3x.png";
import sizeIcon from "@/assets/ic_size@3x.png";
import constructionIcon from "@/assets/ic_construction_date@3x.png";

export default {
  data() {
    return {
      backIcon,
      garageIcon,
      bedIcon,
      bathIcon,
      locationIcon,
      sizeIcon,
      euroIcon,
      constructionIcon,
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
    navigateToEditPage(houseId) {
      this.$router.push({ name: "EditListingForm", params: { id: houseId } });
    },
    deleteListing(houseId) {
      if (confirm("Are you sure you want to delete this listing?")) {
        apiService
          .deleteHouse(houseId)
          .then(() => {
            alert("Listing deleted successfully.");
            this.$router.push({ name: "Houses" });
          })
          .catch((error) => {
            console.error("Error deleting listing:", error);
            alert("Failed to delete listing.");
          });
      }
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
.back-to-overview img {
  width: 24px; /* or the size of your icons */
  height: auto;
  margin-right: 0.5rem;
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
.postal-city {
  color: #4a4b4c;
  margin-top: 0.5rem;
}

.house-meta {
  display: flex;
  align-items: flex-start;
  margin: 1rem 0;
  font-size: 0.9rem;
}

.house-meta span {
  margin-right: 1rem;
  display: inline-block;
  color: #4a4b4c;
  padding: 0.5rem 0.5rem;
}
.house-icons {
  color: #4a4b4c;
  display: flex;
  align-items: center;
  margin: 1rem 0;
}
.house-icons img {
  width: 24px; /* or the size of your icons */
  height: auto;
  margin-right: 0.5rem;
}

.price {
  font-weight: bold;
  color: #4a4b4c;
}

.year {
  color: #333;
}

.house-description {
  color: #333;
  line-height: 1.6;
}

.edit-button,
.delete-button {
  margin-top: 20px;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}
.edit-button {
  background-color: #4caf50; /* Green */
  color: white;
}
.delete-button {
  background-color: #f44336; /* Red */
  color: white;
  margin-left: 10px;
}
</style>
