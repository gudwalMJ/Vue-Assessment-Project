<template>
  <div class="new-listing-page">
    <!-- Header section with back navigation and page title -->
    <div class="header-container">
      <a href="/" class="back-to-overview">
        <img :src="backIcon" alt="back" />Back to overview
      </a>
      <h1>Create new listing</h1>
    </div>
    <!-- Form layout for various listing creation -->
    <form @submit.prevent="submitForm" class="form-layout">
      <!-- Input field for street name -->
      <div class="input-container">
        <label for="street-name">Street name*</label>
        <input
          id="street-name"
          v-model.trim="listing.streetName"
          type="text"
          placeholder="Enter the street name"
          required
        />
      </div>
      <!-- Input field for house number -->
      <div class="row">
        <div class="input-container half">
          <label for="house-number">House number*</label>
          <input
            id="house-number"
            v-model.trim="listing.houseNumber"
            type="number"
            placeholder="Enter house number"
            required
          />
        </div>
        <!-- Input field for house number addition -->
        <div class="input-container half">
          <label for="addition">Addition (optional)*</label>
          <input
            id="number-addition"
            v-model.trim="listing.numberAddition"
            type="text"
            placeholder="e.g. A"
          />
        </div>
      </div>
      <!-- Input field for ZIP code -->
      <div class="input-container">
        <label for="zip-code">Postal code*</label>
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
        <label for="image-upload" class="upload-label"
          >Upload picture (PNG or JPG)*</label
        >
        <div class="upload-btn-wrapper">
          <img
            v-if="imagePreviewUrl"
            :src="imagePreviewUrl"
            alt="Image preview"
            class="image-preview"
          />
          <img
            v-else
            src="@/assets/ic_upload@3x.png"
            alt="Upload"
            class="btn-upload"
          />
          <input type="file" id="image-upload" @change="handleImageUpload" />
        </div>
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
      <div class="row">
        <div class="input-container half">
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
        <div class="input-container half">
          <label for="garage-select">Garage*</label>
          <select id="garage-select" v-model="listing.garage" required>
            <option value="" disabled selected>Select</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>
      <!-- Input field for bedrooms -->
      <div class="row">
        <div class="input-container half">
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
        <div class="input-container half">
          <label for="bathrooms">Bathrooms*</label>
          <input
            v-model.number="listing.bathrooms"
            type="number"
            placeholder="Enter amount"
            required
            min="0"
          />
        </div>
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
        <textarea
          id="description"
          v-model.trim="listing.description"
          placeholder="Enter description"
          required
          rows="5"
        ></textarea>
      </div>
      <!-- Submit button -->
      <button
        type="submit"
        :disabled="!formValid"
        :class="{ 'button-active': formValid }"
      >
        POST
      </button>

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
    // Initial data properties for the listing and form state
    return {
      backIcon,
      listing: {
        streetName: "",
        houseNumber: null,
        numberAddition: "",
        zip: "",
        city: "",
        price: null,
        size: null,
        bedrooms: null,
        bathrooms: null,
        constructionYear: null,
        garage: "",
        description: "",
        image: null,
      },
      error: false,
      errorMessage: "",
      selectedFileName: "",
      imagePreviewUrl: "",
    };
  },
  computed: {
    // Computed property to determine if the form is valid for submission
    formValid() {
      // Logic to determine form validity
      return (
        this.listing.streetName.trim() !== "" &&
        this.listing.houseNumber !== null && // Assuming houseNumber is initialized as null
        this.listing.zip.trim() !== "" &&
        this.listing.city.trim() !== "" &&
        this.listing.price > 0 &&
        this.listing.size > 0 &&
        this.listing.bedrooms > 0 &&
        this.listing.bathrooms > 0 &&
        this.listing.constructionYear > 0 &&
        this.listing.garage !== "" &&
        this.listing.description.trim() !== "" &&
        // Assuming image is required, ensure it has a value
        this.listing.image
      );
    },
  },
  methods: {
    // Validates form data
    validateForm() {
      // Custom validation logic
      if (this.listing.price <= 0) {
        this.error = true;
        this.errorMessage = "Price must be greater than zero.";
        return false;
      }
      return true; // Form is valid
    },
    // Submits the form data
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
    // Handles file selection for image upload
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.listing.image = file; // Set the file to your data property if needed
        // Create a URL for the file to preview the image
        this.imagePreviewUrl = URL.createObjectURL(file);
      }
    },
  },
};
</script>
<style scoped>
/* Main styles for the new listing page */
.new-listing-page {
  margin-top: 50px; /* Adjust as needed */
  background-image: url("@/assets/img_background@3x.png");
  background-size: cover;
  background-position: center;
  padding: 20px;
  margin-left: auto;
  margin-right: auto;
  font-family: "Montserrat", sans-serif;
}
/* Styles for header container */
.header-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 250px;
  margin-top: 40px;
}
.back-to-overview {
  display: flex;
  align-items: center; /* This ensures that the image aligns nicely with the text */
  margin-bottom: 1rem;
  color: #4a4b4c;
  text-decoration: none;
  font-size: 16px;
  font-weight: bold;
}
.back-to-overview img {
  width: 18px;
  height: auto;
  margin-right: 0.5rem;
}
.new-listing-page h1 {
  margin-top: 20px; /* Adjust this value as needed */
  margin-bottom: 30px;
  font-size: 32px;
  color: #000000;
  font-weight: bold;
}
/* Styles for the form layout */
.form-layout {
  margin-left: 250px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
/* Input field styles */
.input-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  width: 420px;
}
/* Styles for labels */
.input-container label {
  align-self: flex-start; /* Aligns the label to the left */
  margin-bottom: 5px;
  font-size: 18px;
}
.input-container.half {
  flex: 1;
  flex-grow: 0;
  flex-shrink: 0;
}
.input-container.half:first-child {
  flex-basis: 200px;
}
.input-container.half:last-child {
  flex-grow: 1;
  margin-left: 10px;
}
.row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.row .input-container {
  width: 200px; /* Smaller width for input containers inside a row */
}
.new-listing-page textarea {
  padding: 10px;
  border: 1px;
  border-radius: 5px;
  width: 100%;
  height: auto;
  box-sizing: border-box;
  resize: none;
}
#description::placeholder {
  /* targeting the placeholder inside the textarea */
  font-family: inherit;
  color: inherit;
  opacity: 1;
}
#description {
  font-family: "Montserrat", sans-serif;
  color: #4a4b4c;
  font-size: 14px;
}

.new-listing-page label {
  display: block;
  margin-bottom: 5px;
  color: #333;
}
/* Styles for individual input fields */
.new-listing-page input[type="text"],
.new-listing-page select,
.new-listing-page input[type="number"] {
  padding: 15px;
  border: 1px;
  border-radius: 5px;
  box-sizing: border-box;
  background-color: #fff;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield; /* Firefox */
}
/* Styles for buttons */
.new-listing-page button {
  background-color: #eb5440; /* Adjust button color as needed */
  color: #fff; /* Adjust button text color as needed */
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  margin-left: 250px;
  width: 170px;
  font-size: 18px;
}
.button-active {
  cursor: pointer;
  background-color: #eb5440;
  color: #fff;
}
.new-listing-page button:disabled {
  background-color: #cccccc; /* A grayed out color indicating it is disabled */
  cursor: not-allowed;
}
.upload-label {
  display: block;
  margin-bottom: 10px;
}
/* Styles for upload button wrapper */
.upload-btn-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  border: 2px dashed #ccc;
  background-color: #f8f8f8;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.btn-upload {
  width: 30px;
  height: auto; /* Adjust based on the desired height */
  border: none;
  background-color: transparent;
  cursor: pointer;
}
/* Styles for image preview */
.image-preview {
  max-width: 100%;
  max-height: 100px;
  object-fit: contain;
}
/* Styles for hidden file input */
#image-upload {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
</style>
