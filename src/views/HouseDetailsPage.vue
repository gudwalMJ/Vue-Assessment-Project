<template>
  <!-- Main container for the house details page -->
  <div class="house-details-page">
    <!-- House details section -->
    <div class="house-details">
      <!-- Back to overview link -->
      <a href="/" class="back-to-overview">
        <img :src="isMobile ? backIconMobile : backIcon" alt="Back" />
        <span v-if="!isMobile">Back to overview</span>
      </a>
      <!-- House image container -->
      <div class="house-image-container">
        <img :src="house?.image || placeholderImage" alt="House image" />
      </div>
      <!-- House content section -->
      <div class="house-content">
        <!-- House title and action buttons -->
        <div class="title-and-actions">
          <h2 class="house-title">
            <!-- House address -->
            {{ house?.location?.street }} {{ house?.location?.houseNumber }}
            <!-- House number addition if present -->
            <span v-if="house?.location?.houseNumberAddition">
              {{ house?.location?.houseNumberAddition }}
            </span>
          </h2>
          <!-- Edit and delete actions if the house is made by the user -->
          <div class="house-actions" v-if="house.madeByMe">
            <router-link
              :to="{ name: 'EditListingForm', params: { id: house.id } }"
              class="action-button"
            >
              <img :src="isMobile ? editIconMobile : editIcon" alt="Edit" />
            </router-link>
            <button
              @click="askDeleteConfirmation(house.id)"
              class="action-button"
            >
              <img
                :src="isMobile ? deleteIconMobile : deleteIcon"
                alt="Delete"
              />
            </button>
          </div>
        </div>
        <p class="postal-city">
          <img :src="locationIcon" alt="Location" /> {{ house?.location?.zip }}
          {{ house?.location?.city }}
        </p>
        <div class="house-meta">
          <span class="price"
            ><img :src="euroIcon" alt="Euros" class="icon" />
            {{ house?.price }}</span
          >
          <span class="size"
            ><img :src="sizeIcon" alt="Size" class="icon" />{{
              house?.size
            }}
            m²</span
          >
          <span class="year"
            ><img :src="constructionIcon" alt="Location" class="icon" />Built in
            {{ house?.constructionYear }}</span
          >
        </div>
        <div class="house-icons">
          <p>
            <span class="icon-text">
              <img :src="bedIcon" alt="Bedrooms" /> {{ house?.rooms?.bedrooms }}
            </span>
            <span class="icon-text">
              <img :src="bathIcon" alt="Bathrooms" />
              {{ house?.rooms?.bathrooms }}
            </span>
            <span class="icon-text">
              <img :src="garageIcon" alt="Garage" />
              {{ house?.hasGarage ? "Yes" : "No" }}
            </span>
          </p>
        </div>
        <div class="house-description">
          {{ house?.description }}
        </div>
      </div>
    </div>
    <!-- Confirmation dialog component for deletion confirmation -->
    <ConfirmationDialog
      :isVisible="showConfirmationDialog"
      title="Delete Listing"
      messagePartOne="Are you sure you want to delete this listing?"
      messagePartTwo="This action cannot be undone."
      @confirm="confirmDeletion"
      @cancel="cancelDeletion"
    />
  </div>
</template>

<script>
// Component and assets imports
import apiService from "@/api/apiService";
import placeholderImage from "@/assets/img_placeholder_house@3x.png";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
// Import the images/icons
import backIcon from "@/assets/ic_back_grey@3x.png";
import backIconMobile from "@/assets/ic_back_white@3x.png";
import editIcon from "@/assets/ic_edit@3x.png";
import deleteIcon from "@/assets/ic_delete@3x.png";
import editIconMobile from "@/assets/ic_edit_white@3x.png";
import deleteIconMobile from "@/assets/ic_delete_white@3x.png";
import garageIcon from "@/assets/ic_garage@3x.png";
import bedIcon from "@/assets/ic_bed@3x.png";
import bathIcon from "@/assets/ic_bath@3x.png";
import locationIcon from "@/assets/ic_location@3x.png";
import euroIcon from "@/assets/ic_price@3x.png";
import sizeIcon from "@/assets/ic_size@3x.png";
import constructionIcon from "@/assets/ic_construction_date@3x.png";

export default {
  components: { ConfirmationDialog },
  data() {
    return {
      backIcon,
      backIconMobile,
      editIcon,
      editIconMobile,
      deleteIcon,
      deleteIconMobile,
      isMobile: false,
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
      showConfirmationDialog: false,
      houseToDelete: null,
    };
  },
  created() {
    this.fetchHouseDetails();
  },
  mounted() {
    this.checkMobile();
    window.addEventListener("resize", this.checkMobile);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkMobile);
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 414;
    },
    // Fetches house details based on the route parameter id
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
          }
        })
        .catch((error) => {
          console.error("Error fetching house details:", error);
        });
    },
    // Navigates to the edit page for the current house
    navigateToEditPage(houseId) {
      this.$router.push({ name: "EditListingForm", params: { id: houseId } });
    },
    // Triggers the confirmation dialog for deletion
    askDeleteConfirmation(houseId) {
      this.houseToDelete = houseId;
      this.showConfirmationDialog = true; // Show the confirmation dialog
    },
    // Confirms the deletion of the house and performs API call
    confirmDeletion() {
      if (this.houseToDelete) {
        apiService
          .deleteHouse(this.houseToDelete)
          .then(() => {
            alert("Listing deleted successfully.");

            this.$router.push({ name: "Houses" });
          })
          .catch((error) => {
            console.error("Error deleting listing:", error);
            alert("Failed to delete listing.");
          })
          .finally(() => {
            this.closeConfirmationDialog(); // Ensure dialog is closed in either case
          });
      }
    },
    // Cancels the deletion process and hides the confirmation dialog
    cancelDeletion() {
      this.closeConfirmationDialog(); // Reset the dialog state when user cancels
    },
    // Resets the confirmation dialog state
    closeConfirmationDialog() {
      this.showConfirmationDialog = false;
      this.houseToDelete = null; // Reset the house to delete
    },
  },
};
</script>

<style scoped>
.house-details-page {
  padding-top: 100px;
  padding-bottom: 100px;
  background-color: #f6f6f6;
  min-height: 100vh;
  font-family: "Montserrat", sans-serif;
}
.house-details {
  max-width: 800px;
  margin: 2rem auto;
  font-family: "Montserrat", sans-serif;
}

.back-to-overview {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  color: #4a4b4c;
  text-decoration: none;
  font-size: 16px;
}
.back-to-overview img {
  width: 18px;
  height: auto;
  margin-right: 0.5rem;
}
.back-to-overview {
  font-weight: bold;
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
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: white;
  border: 1px solid #ddd;
  margin-top: -1px; /* To overlap the image box-shadow */
}

.house-content h2 {
  margin-top: 20px;
  font-size: 32px;
  font-weight: bold;
  font-family: "Montserrat", sans-serif;
}
.postal-city {
  color: #4a4b4c;
  margin-top: 0.5rem;
}
.house-title,
.postal-city {
  text-align: left; /* Align text to the left */
}
.postal-city img {
  height: 20px;
}

.house-meta {
  display: flex;
  align-items: flex-start;
  align-items: center;
  margin: 1rem 0;
  font-size: 16px;
}
.icon {
  width: 20px;
  height: auto;
  margin-right: 5px;
  margin-left: -10px;
  vertical-align: middle;
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
  margin: 0;
}
.house-icons img {
  width: 24px;
  height: auto;
}
.icon-text {
  margin-right: 2rem;
}

.year,
.price {
  color: #4a4b4c;
}

.house-description {
  color: #4a4b4c;
  line-height: 1.5;
  font-size: 18px;
  margin-top: 25px;
  text-align: left;
}
.house-actions {
  align-self: flex-end;
  padding-right: 1rem;
}
.action-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  margin-left: 5px;
}

.action-button img {
  width: 18px;
  height: auto;
}

.title-and-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 22px;
}

@media (max-width: 414px) {
  .house-details-page {
    padding-top: 0;
    padding-bottom: 0;
    background-color: #f6f6f6;
    min-height: 100vh;
  }
  .house-details {
    position: relative;
    margin-top: 0;
  }
  .back-to-overview {
    position: absolute;
    top: 40px;
    left: 20px;
    z-index: 10;
  }
  .house-actions {
    position: absolute;
    top: -240px;
    right: 20px;
    z-index: 10;
  }
  .action-button img {
    width: 12px;
    height: auto;
  }
  .house-image-container {
    margin-top: 0;
  }
  .house-image-container img {
    width: 100%;
    height: auto;
  }

  .house-content {
    position: absolute; /* Absolute position to overlap the image */
    top: calc(
      100% - 10px
    ); /* Adjust the value to overlap the image as needed */
    left: 0;
    right: 0;
    border-radius: 15px 15px 0 0; /* Rounded top edges */
    background: white;
  }
}
</style>
