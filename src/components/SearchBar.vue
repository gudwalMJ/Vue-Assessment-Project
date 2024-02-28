<template>
  <div class="search-bar">
    <input
      v-model="localQuery"
      @input="$emit('update:query', localQuery)"
      placeholder="Search for a house"
      class="search-input"
    />
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
  props: {
    query: String,
  },
  data() {
    return {
      localQuery: this.query,
      searchIcon,
      clearIcon,
    };
  },
  methods: {
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
  background-color: #c3c3c3;
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
  background-color: #c3c3c3;
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
</style>
