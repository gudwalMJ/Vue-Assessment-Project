<template>
  <div class="new-listing-page">
    <a href="/" class="back-to-overview"
      ><img :src="backIcon" alt="back" />Back to overview</a
    >
    <h1>Create New Listing</h1>
    <form @submit.prevent="submitForm">
      <!-- Input field for street name -->
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
      <!-- Input field for house number -->
      <div class="input-container">
        <label for="house-number">House Number*</label>
        <input
          id="house-number"
          v-model.trim="listing.houseNumber"
          type="number"
          placeholder="Enter house number"
          required
        />
      </div>
      <!-- Input field for house number addition -->
      <div class="input-container">
        <label for="addition">Addition (optional)*</label>
        <input
          id="number-addition"
          v-model.trim="listing.numberAddition"
          type="text"
          placeholder="e.g. A"
        />
      </div>
      <!-- Input field for ZIP code -->
      <div class="input-container">
        <label for="zip-code">ZIP Code*</label>
        <input
          id="zip-code"
          v-model.trim="listing.zip"
          type="text"
          placeholder="e.g. 1000 AA"
          required
          pattern="\d{4}\s?[A-Za-z]{2}"
          title="Postal code format: 1000 AA"
        />
      </div>
      <!-- Input field for city -->
      <div class="input-container">
        <label for="city">City*</label>
        <input
          id="city"
          v-model.trim="listing.city"
          type="text"
          placeholder="e.g. Utrecht"
          required
        />
      </div>
      <!-- Input field for Image -->
      <div class="input-container">
        <label for="image">Upload picture (PNG or JPG)*</label>
        <input type="file" @change="handleImageUpload" />
      </div>
      <!-- Input field for price -->
      <div class="input-container">
        <label for="price">Price*</label>
        <input
          v-model.number="listing.price"
          type="number"
          placeholder="e.g. €150.000"
          required
          min="0"
        />
      </div>
      <!-- Input field for size -->
      <div class="input-container">
        <label for="size">Size*</label>
        <input
          v-model.number="listing.size"
          type="number"
          placeholder="e.g. 60m2"
          required
          min="0"
        />
      </div>
      <!-- Input field for garage -->
      <div class="input-container">
        <label for="garage-input">Garage*</label>
        <input
          list="garage-options"
          id="garage-input"
          v-model="listing.garageText"
          @change="updateGarageValue"
          placeholder="Select"
          required
        />
        <datalist id="garage-options">
          <option value="Yes"></option>
          <option value="No"></option>
        </datalist>
      </div>
      <!-- Input field for bedrooms -->
      <div class="input-container">
        <label for="bedrooms">Bedrooms*</label>
        <input
          v-model.number="listing.bedrooms"
          type="number"
          placeholder="Enter amount"
          required
          min="0"
        />
      </div>
      <!-- Input field for bathrooms -->
      <div class="input-container">
        <label for="bathrooms">Bathrooms*</label>
        <input
          v-model.number="listing.bathrooms"
          type="number"
          placeholder="Enter amount"
          required
          min="0"
        />
      </div>
      <!-- Input field for construction year -->
      <div class="input-container">
        <label for="construction">Construction date*</label>
        <input
          v-model.number="listing.constructionYear"
          type="number"
          placeholder="e.g. 1990"
          required
          min="0"
        />
      </div>
      <!-- Input field for description -->
      <div class="input-container">
        <label for="description">Description*</label>
        <input
          v-model.trim="listing.description"
          placeholder="Enter description"
          required
        />
      </div>
      <!-- Submit button -->
      <button type="submit">POST</button>

      <!-- Display error message -->
      <p v-if="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
// Imports
import apiService from "@/api/apiService";
// Imported icons
import backIcon from "@/assets/ic_back_grey@3x.png";

export default {
  data() {
    return {
      backIcon,
      listing: {
        streetName: "",
        houseNumber: "",
        // ...other properties...
      },
      error: false,
      errorMessage: "",
    };
  },
  methods: {
    validateForm() {
      // Example of custom validation logic
      if (this.listing.price <= 0) {
        this.error = true;
        this.errorMessage = "Price must be greater than zero.";
        return false;
      }
      // Add other validation checks as necessary
      return true; // Form is valid
    },

    submitForm() {
      // Reset error state before new submission attempt
      this.error = false;
      this.errorMessage = "";
      // First, validate the form
      if (!this.validateForm()) {
        // Stop the form submission if validation fails
        return;
      }

      // Construct FormData for the API call
      let formData = new FormData();
      formData.append("streetName", this.listing.streetName);
      formData.append("houseNumber", this.listing.houseNumber.toString());
      formData.append("zip", this.listing.zip);
      formData.append("city", this.listing.city);
      formData.append("price", this.listing.price.toString()); // Ensure price is a string
      formData.append("size", this.listing.size.toString());
      formData.append("bedrooms", this.listing.bedrooms.toString());
      formData.append("bathrooms", this.listing.bathrooms.toString());
      formData.append(
        "constructionYear",
        this.listing.constructionYear.toString()
      );
      formData.append("description", this.listing.description);
      formData.append("hasGarage", this.listing.garage ? "true" : "false"); // Convert boolean to string

      if (this.listing.numberAddition) {
        formData.append("numberAddition", this.listing.numberAddition);
      }

      // Append image if it exists
      if (this.listing.image) {
        formData.append("image", this.listing.image);
      }

      // Log FormData for debugging
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Call the API service to create the listing
      apiService
        .createHouse(formData)
        .then((response) => {
          // Redirect to the new listing detail page
          const newListingId = response.data.id;
          this.$router.push({
            name: "HouseDetails",
            params: { id: newListingId },
          });
        })
        .catch((error) => {
          // Handle the submission error
          this.error = true;
          if (error.response && error.response.data) {
            // If the server sends back a detailed error message, display it
            this.errorMessage =
              error.response.data.message ||
              "Failed to create listing. Please check your input.";
          } else {
            // If no detailed error message, fall back to a generic message
            this.errorMessage =
              "Failed to create listing. Please check your input.";
          }
        });
    },
    handleImageUpload(event) {
      // Handle the image file
      const file = event.target.files[0];
      this.listing.image = file;
    },
  },
};
</script>
