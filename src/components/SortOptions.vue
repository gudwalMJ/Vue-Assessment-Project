<template>
  <div class="sort-options">
    <button
      :class="{ active: activeSort === 'price' }"
      @click="$emit('updateSort', 'price')"
    >
      Price
    </button>
    <button
      :class="{ active: activeSort === 'size' }"
      @click="$emit('updateSort', 'size')"
    >
      Size
    </button>
  </div>
</template>

<script>
export default {
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
  margin-left: 0;
  margin-right: 100px;
}
button.active {
  background-color: #eb5440;
}
</style>
