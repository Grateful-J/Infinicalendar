<template>
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <img :src="popUpImage" alt="Popup Image" class="popup-image" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const showModal = ref(false);

const popUpImage = ref("/src/assets/images/yodawg-cal.jpg");

const closeModal = () => {
  showModal.value = false;
};

onMounted(() => {
  showModal.value = true;
});
</script>

<style scoped>
.modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: transparent;
  padding: 0;
  width: 200%;
  max-width: 1000px;
  animation: fadeIn 0.5s ease-in;
}

.popup-image {
  width: 100%;
  height: auto;
  display: block;
}

.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
