<template>
  <!-- Search bar container -->
  <div class="search-bar">
    <!-- Input field for search query -->
    <input
      v-model="localQuery"
      @input="$emit('update:query', localQuery)"
      placeholder="Search for a house"
      class="search-input"
    />
    <!-- Clear search icon, shown when there is a query -->
    <img
      v-if="localQuery"
      src="@/assets/ic_clear@3x.png"
      alt="Clear"
      class="clear-icon"
      @click="clearSearch"
    />
  </div>
</template>

<script>
// Import the icons
import searchIcon from "@/assets/ic_search@3x.png";
import clearIcon from "@/assets/ic_clear@3x.png";

export default {
  // Component receives a 'query' prop from the parent
  props: {
    query: String,
  },
  data() {
    return {
      localQuery: this.query, // Local reactive property for the search input
      searchIcon,
      clearIcon,
    };
  },
  methods: {
    // Method to clear the search query
    clearSearch() {
      this.localQuery = "";
      this.$emit("update:query", this.localQuery);
    },
  },
};
</script>

<style scoped>
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #e8e8e8;
  border-radius: 5px;
  width: 400px;
  height: 30px;
  margin-left: 270px;
}
.search-input {
  flex-grow: 1; /* Let the input grow to fill the container */
  margin: 0;
  padding: 5px 35px 5px 35px;
  font-size: 1em;
  background-image: url("@/assets/ic_search@3x.png");
  background-size: 20px 20px;
  background-color: #e8e8e8;
  background-position: 10px center;
  background-repeat: no-repeat;
  border: none;
  height: 100%;
  color: #4a4b4c;
  outline: none;
  border-radius: 5px;
  margin-top: 20px;
}
.clear-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(0%);
  cursor: pointer;
  width: 15px;
  height: 15px;
}
@media (max-width: 414px) {
  .search-bar {
    width: calc(100% - 40px);
    margin: 20px 20px;
    height: 30px;
  }
  .search-input {
    padding-left: 40px;
  }
  .clear-icon {
    top: 21px;
    right: 10px;
    width: 20px;
    height: 20px;
    transform: translateY(-50%);
  }
}
</style>
