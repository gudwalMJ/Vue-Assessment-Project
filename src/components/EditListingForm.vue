<template>
  <div class="edit-listing-page">
    <a href="/" class="back-to-overview"
      ><img :src="backIcon" alt="back" />Back to overview</a
    >
    <h1>Edit Listing</h1>
    <form @submit.prevent="submitForm">
      <!-- Form fields similar to NewListingForm.vue, but with v-models bound to existing data -->
      <div class="input-container">
        <label for="street-name">Street Name*</label>
        <input
          id="street-name"
          v-model.trim="listing.streetName"
          type="text"
          placeholder="Enter the street name"
          required
        />
      </div>
      <!-- More fields here -->
      <!-- Submit button -->
      <button type="submit">Update</button>
      <!-- Display error message -->
      <p v-if="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import apiService from "@/api/apiService";
import backIcon from "@/assets/ic_back_grey@3x.png";

export default {
  data() {
    return {
      backIcon,
      listing: {
        // Initialize your listing model here
      },
      error: false,
      errorMessage: "",
    };
  },
  created() {
    this.fetchListingDetails();
  },
  methods: {
    fetchListingDetails() {
      const houseId = this.$route.params.id;
      apiService
        .getHouseById(houseId)
        .then((response) => {
          this.listing = response.data;
        })
        .catch((error) => {
          console.error("Error fetching listing details:", error);
          this.error = true;
          this.errorMessage = "Failed to load listing details.";
        });
    },
    submitForm() {
      // Construct FormData for the API call
      let formData = new FormData();
      // Append updated listing details to formData
      // formData.append("streetName", this.listing.streetName);
      // More formData appends here...

      // Call the API service to update the listing
      apiService
        .editHouse(this.listing.id, formData)
        .then(() => {
          this.$router.push({
            name: "HouseDetails",
            params: { id: this.listing.id },
          });
        })
        .catch((error) => {
          console.error("Error updating listing:", error);
          this.error = true;
          this.errorMessage = "Failed to update listing.";
        });
    },
    // handleImageUpload method if you're allowing image updates
  },
};
</script>

<style scoped>
/* Add your CSS here, similar to NewListingForm.vue */
</style>
