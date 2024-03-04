<template>
  <div class="content-container">
    <!-- Title -->
    <div class="title-container">
      <h1 class="title">Houses</h1>
      <!-- Toggle button for showing the create listing form -->
      <router-link to="/new-listing" class="create-listing-button"
        ><img :src="plusIcon" alt="Create New" class="plus-icon" /> Create
        New</router-link
      >
      <!-- Create listing form -->
      <div v-if="showCreateForm">
        <NewListingForm @listing-created="handleListingCreated" />
      </div>
    </div>
    <!-- Search and sort -->
    <div class="search-and-sort-container">
      <SearchBar :query="searchQuery" @update:query="searchQuery = $event" />

      <SortOptions :activeSort="activeSort" @updateSort="updateSortMethod" />
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
import plusIcon from "@/assets/ic_plus_white@3x.png";
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
      plusIcon,
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
  max-width: 200px;
  max-height: 200px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 10px;
}
.details {
  display: flex;
  flex-direction: column;
  padding: 15px;
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
  font-size: 1em;
}
</style>
