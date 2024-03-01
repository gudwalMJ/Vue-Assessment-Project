<template>
  <div class="content-container">
    <!-- Title -->
    <div class="title-container">
      <h1 class="title">Houses</h1>
      <!-- Toggle button for showing the create listing form -->
      <router-link to="/new-listing" class="create-listing-button"
        >+ Create New</router-link
      >
      <!-- Create listing form -->
      <div v-if="showCreateForm">
        <NewListingForm @listing-created="handleListingCreated" />
      </div>
    </div>
    <!-- Search and sort -->
    <div class="search-and-sort-container">
      <SearchBar :query="searchQuery" @update:query="searchQuery = $event" />
      <div class="sort-options-container">
        <SortOptions :activeSort="activeSort" @updateSort="updateSortMethod" />
      </div>
    </div>
    <!-- Result indication -->
    <div v-if="searchQuery" class="results-indication">
      <p v-if="filteredHouses.length">
        {{ filteredHouses.length }} results found
      </p>
    </div>
    <!-- Houses list -->
    <div class="houses" v-if="filteredHouses.length">
      <div
        v-for="house in filteredHouses"
        :key="house.id"
        class="house"
        @click="goToHouseDetails(house.id)"
      >
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
    <!-- Empty state -->
    <div v-else-if="searchQuery" class="empty-state-container">
      <img
        src="@/assets/img_empty_houses@3x.png"
        alt="No houses found"
        class="empty-state-image"
      />
      <p>No results found.</p>
      <p>Please try another keyword.</p>
    </div>
  </div>
</template>

<script>
import apiService from "@/api/apiService";
// Import Components
import SearchBar from "@/components/SearchBar.vue";
import SortOptions from "@/components/SortOptions.vue";
import NewListingForm from "@/components/NewListingForm.vue";
// Import the placeholder image for houses
import placeholderImage from "@/assets/img_placeholder_house@3x.png";
// Import the images/icons
import sizeIcon from "@/assets/ic_size@3x.png";
import bedIcon from "@/assets/ic_bed@3x.png";
import bathIcon from "@/assets/ic_bath@3x.png";

export default {
  components: {
    SearchBar,
    SortOptions,
    NewListingForm,
  },
  data() {
    return {
      sizeIcon,
      bedIcon,
      bathIcon,
      placeholderImage,
      houses: [],
      searchQuery: "",
      activeSort: null,
      showCreateForm: false,
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
    goToHouseDetails(houseId) {
      this.$router.push({ name: "HouseDetails", params: { id: houseId } });
    },
    handleListingCreated(newListingId) {
      this.showCreateForm = false; // Hide the form
      this.fetchHouses(); // Refresh the list, or add the new listing to it
      this.$router.push({ name: "HouseDetails", params: { id: newListingId } });
    },
  },
};
</script>

<style scoped>
.content-container {
  padding-top: 60px;
  background-color: #f6f6f6;
  min-height: 100vh;
  font-family: "Montserrat", sans-serif;
}
.title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px; /* Adjust as needed for spacing */
  padding: 0 15px; /* Add padding to match the design spacing */
}
.title {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 50px;
  margin-bottom: 30px; /* Space between the title and the search bar */
  margin-left: 270px;
  font-size: 32px;
  font-weight: bold;
}
.search-and-sort-container {
  display: flex;
  justify-content: space-between;
  gap: 10px; /* Adjust gap as needed */
  margin-top: 20px; /* Adjust as needed for spacing */
  padding: 0 15px; /* Add padding to match the design spacing */
  margin-right: 90px;
  margin-left: -15px;
}
.sort-options-container {
  display: flex;
  gap: 0px; /* Reduce the gap to bring elements closer */
  align-items: center; /* Center-align the items vertically */
  justify-content: start; /* Align items to the start of the container */
}

.results-indication {
  margin-top: 50px; /* Space directly below the search bar */
  margin-left: 270px;
  font-size: 20px;
  font-weight: bold;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.houses {
  margin-top: 50px; /* Adjust based on the height of your fixed header */
  background-color: #f6f6f6;
}

.house {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(250px, 1fr)
  ); /* Adjust minmax for your card width */
  gap: 20px; /* Adjust gap as needed */
  padding: 0 15px; /* Add padding to match the design spacing */
  margin-left: 270px;
  margin-right: 200px;
  margin-bottom: 20px;
  background-color: #ffffff;
}
.house-image {
  max-width: 2000px;
  max-height: 200px;
  object-fit: cover;
}
.details img {
  width: 24px;
  height: 24px;
  vertical-align: middle;
}
.empty-state-image {
  display: block;
  width: 250px;
  height: 250px;
  margin: 0 auto 20px;
  object-fit: contain;
}
.empty-state-container {
  text-align: center;
  padding: 20px;
}
.empty-state-container p {
  margin: 0;
  color: #4a4b4c;
  font-size: 1em;
}
</style>
