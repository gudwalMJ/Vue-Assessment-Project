<template>
  <div class="edit-listing-page">
    <a href="/" class="back-to-overview">
      <img :src="backIcon" alt="Back" /> Back to overview
    </a>
    <h1>Edit Listing</h1>
    <form @submit.prevent="submitForm">
      <!-- Input for StreetName -->
      <div class="input-container">
        <label for="street-name">Street Name*</label>
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
      <div class="input-container">
        <label for="house-number">House Number*</label>
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
      <div class="input-container">
        <label for="addition">Addition (optional)</label>
        <input
          id="addition"
          v-model="listing.location.numberAddition"
          type="text"
          placeholder="e.g. A"
          v-if="listing && listing.location"
        />
      </div>
      <!-- Input for ZIP -->
      <div class="input-container">
        <label for="zip-code">ZIP Code*</label>
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
      <div class="input-container">
        <label for="image">Upload picture (PNG or JPG)*</label>
        <input
          type="file"
          id="image"
          @change="handleImageUpload"
          v-if="listing && listing.location"
        />
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
      <div class="input-container">
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
      <div class="input-container">
        <label for="hasGarage">Garage*</label>
        <select id="hasGarage" v-model="listing.hasGarage">
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
      <!-- Input for Bedrooms -->
      <div class="input-container">
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
      <div class="input-container">
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
          v-if="listing && listing.location"
        ></textarea>
      </div>
      <!-- SAVE -->
      <button type="submit">Save</button>
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
  created() {
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
    loadExistingData() {
      const houseId = this.$route.params.id;
      apiService
        .getHouseById(houseId)
        .then((response) => {
          // Assuming response.data has the structure { streetName, houseNumber, ... }
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
    // HandleImageUpload
    handleImageUpload(event) {
      this.listing.image = event.target.files[0];
    },
    // Validation Forms
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
    // SUBMIT form
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
/* Add styles similar to NewListingForm.vue */
</style>
