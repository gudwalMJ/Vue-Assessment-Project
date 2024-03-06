<template>
  <div class="content-container">
    <!-- Title and navigation to create new listing -->
    <div class="title-container">
      <h1 class="title">Houses</h1>
      <!-- Display the white icon for larger screens and grey icon for mobile -->
      <router-link to="/new-listing" class="create-listing-button">
        <img
          :src="isMobile ? plusIconGrey : plusIcon"
          alt="Create New"
          class="plus-icon"
        />
        <span v-if="!isMobile">Create New</span>
      </router-link>

      <!-- Show form to create a new listing -->
      <div v-if="showCreateForm">
        <NewListingForm @listing-created="handleListingCreated" />
      </div>
    </div>

    <!-- Search bar and sorting options -->
    <div class="search-and-sort-container">
      <SearchBar :query="searchQuery" @update:query="searchQuery = $event" />

      <SortOptions :activeSort="activeSort" @updateSort="updateSortMethod" />
    </div>

    <!-- Indication of search results -->
    <div v-if="searchQuery" class="results-indication">
      <p v-if="filteredHouses.length">
        {{ filteredHouses.length }} results found
      </p>
    </div>

    <!-- List of houses -->
    <div class="houses" v-if="filteredHouses.length">
      <div
        v-for="house in filteredHouses"
        :key="house.id"
        class="house"
        @click="goToHouseDetails(house.id)"
      >
        <!-- House image -->
        <img
          :src="house.image || placeholderImage"
          alt="House image"
          class="house-image"
        />
        <!-- House details -->
        <div class="details">
          <p class="street">
            {{
              `${house.location.street} ${house.location.houseNumber}${
                house.location.houseNumberAddition || ""
              }`
            }}
          </p>
          <p class="price">€ {{ formatPrice(house.price) }}</p>
          <p class="zip-city">
            {{ `${house.location.zip} ${house.location.city}` }}
          </p>
          <p class="info">
            <img :src="bedIcon" alt="Bedrooms" /> {{ house.rooms.bedrooms }}
            <img :src="bathIcon" alt="Bathrooms" /> {{ house.rooms.bathrooms }}
            <img :src="sizeIcon" alt="Size" /> {{ house.size }} m2
          </p>
        </div>

        <!-- Actions for editing and deleting a listing -->
        <div class="house-footer" v-if="house.madeByMe">
          <button
            @click.stop="navigateToEditPage(house.id)"
            class="action-button edit"
          >
            <img src="@/assets/ic_edit@3x.png" alt="Edit" />
          </button>

          <button
            @click.stop="askDeleteConfirmation(house.id)"
            class="action-button delete"
          >
            <img src="@/assets/ic_delete@3x.png" alt="Delete" />
          </button>
        </div>
      </div>
    </div>

    <!-- State when no results are found -->
    <div v-else-if="searchQuery" class="empty-state-container">
      <img
        src="@/assets/img_empty_houses@3x.png"
        alt="No houses found"
        class="empty-state-image"
      />
      <p>No results found.</p>
      <p>Please try another keyword.</p>
    </div>

    <!-- Confirmation dialog for deletion -->
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
import apiService from "@/api/apiService";
// Import Components
import SearchBar from "@/components/SearchBar.vue";
import SortOptions from "@/components/SortOptions.vue";
import NewListingForm from "@/components/NewListingForm.vue";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
// Import the placeholder image for houses
import placeholderImage from "@/assets/img_placeholder_house@3x.png";
// Import the images/icons
import plusIcon from "@/assets/ic_plus_white@3x.png";
import plusIconGrey from "@/assets/ic_plus_grey@3x.png";
import sizeIcon from "@/assets/ic_size@3x.png";
import bedIcon from "@/assets/ic_bed@3x.png";
import bathIcon from "@/assets/ic_bath@3x.png";

export default {
  components: {
    SearchBar,
    SortOptions,
    NewListingForm,
    ConfirmationDialog,
  },
  data() {
    return {
      plusIcon,
      plusIconGrey,
      sizeIcon,
      bedIcon,
      bathIcon,
      placeholderImage,
      houses: [],
      searchQuery: "",
      activeSort: null,
      showCreateForm: false,
      showConfirmationDialog: false,
      houseToDelete: null,
      isMobile: window.innerWidth <= 414,
    };
  },
  computed: {
    filteredHouses() {
      if (!this.searchQuery.trim()) {
        return this.houses;
      }
      const queryLower = this.searchQuery.toLowerCase();
      return this.houses.filter((house) => {
        // Check if any of the properties match the search query
        return (
          house.description.toLowerCase().includes(queryLower) ||
          house.price.toString().includes(queryLower) ||
          house.location.zip.toLowerCase().includes(queryLower) ||
          house.size.toString().includes(queryLower) ||
          house.location.city.toLowerCase().includes(queryLower)
        );
      });
    },
  },
  created() {
    this.fetchHouses();
    window.addEventListener("resize", this.checkMobile);
    this.checkMobile();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkMobile);
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 414;
    },
    // FETCH Houses
    fetchHouses() {
      apiService
        .getHouses()
        .then((response) => {
          this.houses = response.data;
        })
        .catch((error) => {
          console.error("Error fetching houses:", error);
        });
    },
    // FORMAT price
    formatPrice(price) {
      return new Intl.NumberFormat("de-DE").format(price);
    },
    // SORT method
    updateSortMethod(sortOption) {
      this.activeSort = sortOption;
      const sortFunction = (a, b) => {
        if (sortOption === "price") {
          return a.price - b.price;
        } else if (sortOption === "size") {
          return a.size - b.size;
        }
      };
      this.houses.sort(sortFunction);
    },
    // Route to HoseDetails
    goToHouseDetails(houseId) {
      this.$router.push({ name: "HouseDetails", params: { id: houseId } });
    },
    // Creation of new Listing
    handleListingCreated(newListingId) {
      this.showCreateForm = false; // Hide the form
      this.fetchHouses(); // Refresh the list, or add the new listing to it
      this.$router.push({ name: "HouseDetails", params: { id: newListingId } });
    },
    // Route to EditPage
    navigateToEditPage(houseId) {
      this.$router.push({ name: "EditListingForm", params: { id: houseId } });
    },
    // Delete listing
    askDeleteConfirmation(houseId) {
      this.houseToDelete = houseId;
      this.showConfirmationDialog = true; // Show the confirmation dialog
    },

    confirmDeletion() {
      if (this.houseToDelete) {
        apiService
          .deleteHouse(this.houseToDelete)
          .then(() => {
            alert("Listing deleted successfully.");
            this.fetchHouses(); // Refresh the list after deletion
            this.closeConfirmationDialog(); // Reset the dialog state
          })
          .catch((error) => {
            console.error("Error deleting listing:", error);
            alert("Failed to delete listing.");
            this.closeConfirmationDialog(); // Reset the dialog state
          });
      }
    },

    cancelDeletion() {
      this.closeConfirmationDialog(); // Reset the dialog state when user cancels
    },

    closeConfirmationDialog() {
      this.showConfirmationDialog = false;
      this.houseToDelete = null; // Reset the house to delete
    },
  },
};
</script>

<style scoped>
/* General layout and container styles */
.content-container {
  padding-top: 60px;
  padding-bottom: 60px;
  background-color: #f6f6f6;
  min-height: 100vh;
  font-family: "Montserrat", sans-serif;
}
.title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 0 15px;
  margin-right: 185px;
  margin-bottom: 10px;
}
.title {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 30px;
  margin-bottom: 30px;
  margin-left: 255px;
  font-size: 32px;
  font-weight: bold;
}
.create-listing-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  border-radius: 5px;
  background-color: #eb5440;
  padding: 10px;
  width: 150px;
  justify-content: center;
  text-decoration: none;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
}

.plus-icon {
  width: 15px;
  height: 15px;
}
.search-and-sort-container {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-right: 200px;
}

.results-indication {
  margin-top: 50px;
  margin-left: 270px;
  font-size: 20px;
  font-weight: bold;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.houses {
  margin-top: 50px;
  background-color: #f6f6f6;
  display: flex;
  flex-direction: column;
  gap: 20px; /* This adds space between the cards */
  margin-bottom: 50px;
}

.house {
  display: flex;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  background-color: #ffffff;
  margin-left: 270px;
  margin-right: 200px;
  padding: 15px;
  align-items: center;
}
.house-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 10px;
  cursor: pointer;
}
.details {
  display: flex;
  flex-direction: column;
  padding: 10px 15px 15px;
  gap: 5px;
  align-items: flex-start;
  flex-grow: 1;
}

.details p {
  margin: 0;
  color: #4a4b4c;
  font-size: 18px;
}
.details p.street {
  font-weight: bold;
  font-size: 22px;
  color: #000000;
}
.details p.price {
  color: #000000;
  font-size: 18px;
  font-weight: 500;
}
.details p.zip-city {
  color: #c3c3c3;
}
.details p.info {
  display: flex;
  align-items: center;
  gap: 15px;
}
.details p.info img {
  width: 24px;
  height: 24px;
}
.house-footer {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 5px;
  margin-top: -120px;
}
/* Styling for action buttons (edit and delete) */
.action-button {
  border: none;
  background: none;
  cursor: pointer;
  padding: 5px;
  margin-left: 5px;
}
.action-button img {
  width: 15px;
  height: 15px;
  display: block; /* Ensure it’s visible */
}
.empty-state-image {
  display: block;
  width: 250px;
  height: 250px;
  object-fit: contain;
}
.empty-state-container {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.empty-state-container p {
  color: #4a4b4c;
  font-size: 18px;
}

/* General mobile styling */
@media (max-width: 414px) {
  .content-container {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  /* Title and create new button */
  .title-container {
    position: relative;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: -20px;
  }
  .title {
    font-size: 24px;
    margin-left: 170px;
  }
  .plus-icon {
    position: absolute;
    width: 16px; /* Size for the grey icon */
    height: 16px;
  }
  .create-listing-button {
    position: absolute;
    right: -180px; /* Adjust the value as needed to align it to the right edge */
    width: 16px; /* Size for the grey icon */
    height: 16px;
    background: none; /* Ensure no background */
    border: none; /* Ensure no border */
    box-shadow: none; /* Ensure no shadow */
  }

  .results-indication {
    margin: 50px 0;
    margin-bottom: -40px;
    font-size: 18px;
    width: 100%;
    text-align: left;
    padding-left: 20px;
  }

  /* Adjust the search bar and sorting options container */
  .search-and-sort-container {
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
  }

  /* Houses list adjustments */
  .houses {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 390px;
    margin: 50px auto;
  }

  .house {
    width: 90%;
    margin: 0;
  }
  .house-image {
    width: 100px;
    height: 100px;
  }
  .details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .details p {
    font-size: 14px;
    margin: 0;
  }

  .details p.street {
    font-weight: bold;
    font-size: 18px;
    color: #000000;
  }
  .details p.price {
    color: #000000;
    font-size: 14px;
    font-weight: 500;
  }
  .details p.zip-city {
    color: #c3c3c3;
    font-size: 14px;
  }

  .details p.info img {
    width: 14px;
    height: 14px;
  }
  .house-footer {
    margin-top: -100px;
  }
  .action-button img {
    width: 16px;
    height: 16px;
  }
}
</style>
