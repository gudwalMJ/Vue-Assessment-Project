<template>
  <!-- Container for the confirmation dialog, shown only if isVisible is true -->
  <div class="confirmation-dialog-container" v-if="isVisible">
    <!-- Dialog box -->
    <div class="confirmation-dialog">
      <!-- Dialog title -->
      <h2 class="dialog-title">{{ title }}</h2>
      <!-- Primary message part -->
      <p class="dialog-message">{{ messagePartOne }}</p>
      <!-- Secondary message part -->
      <p class="dialog-message-secondary">{{ messagePartTwo }}</p>
      <!-- Dialog action buttons -->
      <div class="dialog-actions">
        <!-- Confirmation button -->
        <button @click="confirmAction">YES, DELETE</button>
        <!-- Cancellation button -->
        <button @click="cancelAction">GO BACK</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // Props passed down from parent component
  props: ["isVisible", "title", "messagePartOne", "messagePartTwo"],
  // Component methods
  methods: {
    // Emits a confirm event when the confirmation button is clicked
    confirmAction() {
      this.$emit("confirm");
    },
    // Emits a cancel event when the cancel button is clicked
    cancelAction() {
      this.$emit("cancel");
    },
  },
};
</script>

<style scoped>
.confirmation-dialog-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}
.confirmation-dialog {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  text-align: center;
}
.dialog-title {
  margin-top: 20px;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
}
.dialog-message {
  font-size: 16px;
}
.dialog-message-secondary {
  margin-bottom: 30px;
  font-size: 16px;
}
.dialog-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.dialog-actions button {
  margin: 10px 0;
  padding: 10px 20px;
  width: 350px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  font-weight: bold;
  font-size: 18px;
  text-align: center;
}
.dialog-actions button:first-child {
  background-color: #eb5440; /* HEX color for the 'YES, DELETE' button */
}
.dialog-actions button:last-child {
  background-color: #4a4b4c; /* HEX color for the 'GO BACK' button */
}
</style>
