<template>
  <!-- Sort options container -->
  <div class="sort-options">
    <!-- Button for sorting by price -->
    <button
      class="first"
      :class="{ active: activeSort === 'price' }"
      @click="$emit('updateSort', 'price')"
    >
      Price
    </button>

    <!-- Button for sorting by size -->
    <button
      class="second"
      :class="{ active: activeSort === 'size' }"
      @click="$emit('updateSort', 'size')"
    >
      Size
    </button>
  </div>
</template>

<script>
export default {
  // Component properties
  props: {
    activeSort: String,
  },
};
</script>

<style scoped>
.sort-options {
  display: flex;
}
button {
  background-color: #c3c3c3;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  width: 110px;
  height: 40px;
}
button.active {
  background-color: #eb5440;
}
/* Styling for the two buttons to get pill shape */
.first {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.second {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

/* Media query for mobile devices */
@media (max-width: 414px) {
  .sort-options {
    width: calc(100% - 40px);
    margin: 0 20px;
    justify-content: space-between;
    margin-bottom: -30px;
  }
  button {
    flex: 1;
    margin: 5px;
    padding: 10px 0;
  }
  .first {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .second {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .first {
    margin-right: 0px; /* Ensure a small gap between the buttons */
  }
  .second {
    margin-left: 0; /* Ensure a small gap between the buttons */
  }
}
</style>
