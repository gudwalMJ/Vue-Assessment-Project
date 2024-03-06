<template>
  <div class="edit-listing-page">
    <!-- Header section with back navigation and page title -->
    <div class="header-container">
      <router-link to="/" class="back-to-overview">
        <img :src="backIcon" alt="Back" class="back-icon" />
        <span class="back-text">Back to detail page</span>
      </router-link>
      <h1>Edit Listing</h1>
    </div>
    <!-- Form layout for editing listing -->
    <form @submit.prevent="submitForm" class="form-layout">
      <!-- Input for StreetName -->
      <div class="input-container">
        <label for="street-name">Street name*</label>
        <input
          id="street-name"
          v-model="listing.location.street"
          type="text"
          placeholder="Enter the street name"
          required
          v-if="listing && listing.location"
        />
      </div>
      <!-- Input for HouseNumber -->
      <div class="row">
        <div class="input-container half">
          <label for="house-number">House number*</label>
          <input
            id="house-number"
            v-model="listing.location.houseNumber"
            type="text"
            placeholder="Enter house number"
            required
            v-if="listing && listing.location"
          />
        </div>

        <!-- Input for HouseAddition -->

        <div class="input-container half">
          <label for="addition">Addition (optional)</label>
          <input
            id="addition"
            v-model="listing.location.numberAddition"
            type="text"
            placeholder="e.g. A"
            v-if="listing && listing.location"
          />
        </div>
      </div>
      <!-- Input for ZIP -->
      <div class="input-container">
        <label for="zip-code">Postal code*</label>
        <input
          id="zip-code"
          v-model="listing.location.zip"
          type="text"
          placeholder="e.g. 1000 AA"
          required
          pattern="\d{4}\s?[A-Za-z]{2}"
          title="Postal code format: 1000 AA"
          v-if="listing && listing.location"
        />
      </div>
      <!-- Input for City -->
      <div class="input-container">
        <label for="city">City*</label>
        <input
          id="city"
          v-model="listing.location.city"
          type="text"
          placeholder="e.g. Utrecht"
          required
          v-if="listing && listing.location"
        />
      </div>
      <!-- Input for Image Upload -->
      <!-- Input field for Image Upload -->
      <div class="input-container">
        <label for="image-upload" class="upload-label"
          >Upload picture (PNG or JPG)*</label
        >
        <div class="upload-btn-wrapper">
          <!-- Show image preview if an image has been uploaded or if there is an existing image -->
          <img
            v-if="imagePreviewUrl || (listing && listing.image)"
            :src="imagePreviewUrl || listing.image"
            alt="Image preview"
            class="image-preview"
          />

          <!-- Show the upload icon if there is no image preview URL and no existing image -->
          <img
            v-else
            src="@/assets/ic_upload@3x.png"
            alt="Upload"
            class="btn-upload"
            @click="triggerFileInput"
          />

          <!-- Clear image button (displayed only when there is an image preview or an existing image) -->
          <button
            v-if="imagePreviewUrl || (listing && listing.image)"
            @click="clearImage"
            type="button"
            class="clear-image-btn"
          >
            <img src="@/assets/ic_clear_white@3x.png" alt="Clear" />
          </button>

          <!-- Hidden file input field -->
          <input
            type="file"
            id="image-upload"
            @change="handleImageUpload"
            ref="fileInput"
            hidden
          />
        </div>
      </div>

      <!-- Input for Price -->
      <div class="input-container">
        <label for="price">Price*</label>
        <input
          id="price"
          v-model.number="listing.price"
          type="number"
          placeholder="Enter price"
          required
          v-if="listing && listing.location"
        />
      </div>
      <!-- Input for Size -->
      <div class="row">
        <div class="input-container half">
          <label for="size">Size*</label>
          <input
            id="size"
            v-model.number="listing.size"
            type="number"
            placeholder="Enter size"
            required
            v-if="listing && listing.location"
          />
        </div>

        <!-- Input for Garage -->
        <div class="input-container half">
          <label for="garage-select">Garage*</label>
          <select id="garage-select" v-model="listing.hasGarage" required>
            <option value="" disabled selected>Select</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>
      <!-- Input for Bedrooms -->
      <div class="row">
        <div class="input-container half">
          <label for="bedrooms">Bedrooms*</label>
          <input
            id="bedrooms"
            v-model.number="listing.bedrooms"
            type="number"
            placeholder="Enter amount"
            required
            v-if="listing && listing.location"
          />
        </div>
        <!-- Input for Bathrooms -->
        <div class="input-container half">
          <label for="bathrooms">Bathrooms*</label>
          <input
            id="bathrooms"
            v-model.number="listing.bathrooms"
            type="number"
            placeholder="Enter amount"
            required
            v-if="listing && listing.location"
          />
        </div>
      </div>
      <!-- Input for Construction Year -->
      <div class="input-container">
        <label for="constructionYear">Construction date*</label>
        <input
          id="constructionYear"
          v-model="listing.constructionYear"
          type="number"
          placeholder="Enter construction year"
          required
          v-if="listing && listing.location"
        />
      </div>
      <!-- Input for Description -->
      <div class="input-container">
        <label for="description">Description*</label>
        <textarea
          id="description"
          v-model="listing.description"
          placeholder="Enter description"
          required
          rows="5"
          v-if="listing && listing.location"
        ></textarea>
      </div>
      <!-- SAVE -->
      <button type="submit" class="save-button">Save</button>
      <!-- Display error message -->
      <p v-if="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
// Imports
import apiService from "@/api/apiService";
import backIcon from "@/assets/ic_back_grey@3x.png";

export default {
  data() {
    // Initial data properties for the listing and form state
    return {
      backIcon,
      imagePreviewUrl: null,
      listing: {
        location: {},
        // Initialize other expected properties similarly
        price: "",
        bedrooms: "",
        bathrooms: "",
        size: "",
        constructionYear: "",
        hasGarage: false,
        description: "",
        image: null, // Assuming this will be a File object
      },

      error: false,
      errorMessage: "",
    };
  },
  // Lifecycle hook for initializing component data
  created() {
    // Logic to fetch existing data for editing
    const houseId = this.$route.params.id;
    apiService
      .getHouseById(houseId)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          this.listing = response.data[0];
        } else {
          // Handle the case where the house data is empty
          console.error("House data is empty");
        }
      })
      .catch((error) => {
        console.error("Error fetching house details:", error);
        // Handle errors appropriately (e.g., show an error message)
      });
  },
  methods: {
    // Fetches existing data to be edited
    loadExistingData() {
      const houseId = this.$route.params.id;
      apiService
        .getHouseById(houseId)
        .then((response) => {
          this.listing = {
            streetName: response.data.streetName,
            houseNumber: response.data.houseNumber,
            numberAddition: response.data.numberAddition,
            zip: response.data.zip,
            city: response.data.city,
            // ... other properties as needed
          };
        })
        .catch((error) => {
          console.error("Error loading existing data:", error);
          this.error = true;
          this.errorMessage = "Failed to load existing listing data.";
        });
    },
    // Format ZipCode for spacing
    formatZipCode(zipCode) {
      // Check if the zip code matches the pattern without space
      const zipPattern = /^(\d{4})([A-Za-z]{2})$/;
      const match = zipCode.match(zipPattern);
      if (match) {
        // If it matches, return the formatted ZIP code with a space
        return `${match[1]} ${match[2]}`;
      }
      // If no formatting is needed, return the original ZIP code
      return zipCode;
    },
    // Handles file selection for image upload
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    // Handle the file selection event
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        // Create a URL for the file to preview the image
        this.imagePreviewUrl = URL.createObjectURL(file);
        // You might need to update the listing object accordingly
        this.listing.image = file;
      }
    },

    // Clear the current image selection or existing image
    clearImage() {
      this.imagePreviewUrl = "";
      if (this.listing.image) {
        // Perform any additional cleanup if necessary
        this.listing.image = null;
      }
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
    },
    // Validates the form data
    validateForm() {
      // Initialize the error state to false and clear any previous messages
      this.error = false;
      this.errorMessage = "";

      // Validation Checks
      // Street
      if (!this.listing.location.street) {
        this.error = true;
        this.errorMessage = "Street name is required.";
        return false;
      }
      // HouseNumber
      if (!this.listing.location.houseNumber) {
        this.error = true;
        this.errorMessage = "House number is required.";
        return false;
      }
      // Zip
      if (
        this.listing.location.zip &&
        !/\d{4}\s?[A-Za-z]{2}/.test(this.listing.location.zip)
      ) {
        this.error = true;
        this.errorMessage = "Invalid ZIP code format. Expected format: 1000 AA";
        return false;
      }
      // City
      if (!this.listing.location.city) {
        this.error = true;
        this.errorMessage = "City is required.";
        return false;
      }
      // Price
      if (this.listing.price <= 0) {
        this.error = true;
        this.errorMessage = "Price must be greater than zero.";
        return false;
      }
      // Size
      if (!this.listing.size) {
        this.error = true;
        this.errorMessage = "Size is required.";
        return false;
      }
      // Garage
      if (!this.listing.hasGarage) {
        this.error = true;
        this.errorMessage = "Garage is required.";
        return false;
      }
      // Bedrooms
      if (!this.listing.bedrooms) {
        this.error = true;
        this.errorMessage = "Bedrooms is required.";
        return false;
      }
      // Bathrooms
      if (!this.listing.bedrooms) {
        this.error = true;
        this.errorMessage = "Bahtrooms is required.";
        return false;
      }
      // Description
      if (!this.listing.bedrooms) {
        this.error = true;
        this.errorMessage = "Description is required.";
        return false;
      }
      // If all checks pass, return true
      return true;
    },
    // Submits the form data
    submitForm() {
      // Format the zip code to include a space if needed
      this.listing.location.zip = this.formatZipCode(this.listing.location.zip);

      if (!this.validateForm()) {
        // If the form validation fails, stop the form submission
        return;
      }

      // Construct FormData for the request
      const formData = new FormData();

      // Append listing details to formData
      formData.append("streetName", this.listing.location.street);
      formData.append("houseNumber", this.listing.location.houseNumber);
      if (this.listing.location.numberAddition) {
        formData.append("numberAddition", this.listing.location.numberAddition);
      }
      formData.append("zip", this.listing.location.zip);
      formData.append("city", this.listing.location.city);
      formData.append("price", this.listing.price.toString());
      formData.append("bedrooms", this.listing.bedrooms.toString());
      formData.append("bathrooms", this.listing.bathrooms.toString());
      formData.append("size", this.listing.size.toString());
      formData.append(
        "constructionYear",
        this.listing.constructionYear.toString()
      );
      formData.append("hasGarage", String(this.listing.hasGarage));
      formData.append("description", this.listing.description);

      const houseId = this.$route.params.id;
      // Make the API call to edit the house
      apiService
        .editHouse(houseId, formData)
        .then(() => {
          // If there's an image to upload
          if (this.listing.image) {
            // Now upload the image using a separate API call
            return apiService.uploadHouseImage(houseId, this.listing.image);
          }
        })
        .then(() => {
          // After all updates are successful, navigate to the HouseDetails view
          this.$router.push({ name: "HouseDetails", params: { id: houseId } });
        })
        .catch((error) => {
          // Log and display error information
          console.error("Error updating listing:", error);
          this.error = true;
          this.errorMessage = "Failed to update listing.";
        });
    },
  },
};
</script>

<style scoped>
.edit-listing-page {
  margin-top: 50px; /* Adjust as needed */
  background-image: url("@/assets/img_background@3x.png");
  background-size: cover;
  background-position: center;
  padding: 20px;
  margin-left: auto;
  margin-right: auto;
  font-family: "Montserrat", sans-serif;
}
.edit-listing-page h1 {
  margin-top: 20px; /* Adjust this value as needed */
  margin-bottom: 30px;
  font-size: 32px;
  color: #000000;
  font-weight: bold;
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
.upload-label {
  display: block;
  margin-bottom: 10px;
}
.edit-listing-page textarea {
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
/* Styles for individual input fields */
.edit-listing-page input[type="text"],
.edit-listing-page select,
.edit-listing-page input[type="number"] {
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
.clear-image-btn {
  position: absolute;
  top: -15px;
  right: -15px;
  z-index: 10;
  border: none;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0);
  padding: 5px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.clear-image-btn img {
  width: 24px; /* Adjust size as needed */
  height: 24px;
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
.save-button {
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

@media (max-width: 414px) {
  .edit-listing-page {
    background-color: #f6f6f6;
    padding: 15px; /* Adjust padding for mobile */
    margin-top: 0;
    margin-bottom: 100px;
  }
  .header-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    margin: 0;
    margin-bottom: 30px;
  }
  .header-container h1 {
    font-size: 18px;
    text-align: center;
    flex-grow: 1;
    margin: 0;
  }
  .back-to-overview {
    position: absolute;
    left: 15px;
    margin-bottom: 0;
  }
  .back-to-overview .back-text {
    display: none; /* Hide the text next to the back icon on mobile */
  }
  .form-layout {
    margin-left: 0px;
    margin-right: -30px;
    padding-bottom: 15px;
  }
  .input-container,
  .row .input-container {
    width: calc(100% - 40px); /* full width minus the padding */
  }
  .row {
    display: flex;
    flex-direction: row; /* Align items in a row */
    justify-content: space-between; /* Space items evenly */
  }
  .input-container.half {
    flex: 1; /* Allow each item to grow */
  }
  .save-button {
    margin-left: 0px; /* Align with the rest of the content */
    width: calc(100% - 40px); /* full width minus the padding */
  }
  .input-container.half select {
    width: 180px; /* Ensure the select element fills the container */
  }
}
</style>
