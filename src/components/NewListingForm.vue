<template>
  <div class="new-listing-page">
    <a href="/" class="back-to-overview"
      ><img :src="backIcon" alt="back" />Back to overview</a
    >
    <h1>Create New Listing</h1>
    <form @submit.prevent="submitForm" class="form-layout">
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
      <div class="row">
        <div class="input-container half">
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
          rows="4"
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
    };
  },
  computed: {
    formValid() {
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
<style scoped>
.new-listing-page {
  margin-top: 50px; /* Adjust as needed */
  background-image: url("@/assets/img_background@3x.png");
  background-size: cover;
  background-position: center;
  padding: 20px;
  margin-left: auto;
  margin-right: auto;
}
.form-layout {
  margin-left: 250px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.new-listing-page h1 {
  margin-top: 50px;
  margin-bottom: 50px;
  font-size: 32px;
  color: #000000; /* Adjust text color as needed */
  font-weight: bold;
}

/* Input field styles */
.input-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  width: 420px;
}
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

.new-listing-page label {
  display: block;
  margin-bottom: 5px;
  color: #333;
}

.new-listing-page input[type="text"],
.new-listing-page select,
.new-listing-page input[type="number"] {
  padding: 10px;
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
</style>
