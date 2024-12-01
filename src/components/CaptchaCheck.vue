<template>
  <div class="captcha-container">
    <img :src="draggableImage" draggable="true" @dragstart="handleDragStart" id="draggable-image" alt="Draggable Image" class="captcha-img" />
    <div class="drop-zone" @dragover.prevent @drop="handleDrop">Drop here</div>
    <p v-if="isCompleted" class="text-white text-6xl">Captcha completed!</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const draggableImage = "src/assets/images/drag01.png";
const isCompleted = ref(false);

const handleDragStart = (event) => {
  event.dataTransfer.setData("text", event.target.id);
};

const handleDrop = (event) => {
  event.preventDefault();
  const draggedId = event.dataTransfer.getData("text");
  const completed = draggedId === "draggable-image";
  if (completed) {
    isCompleted.value = true;
    sessionStorage.setItem("captchaCompleted", "true");
    console.log("Captcha solved!");
    window.alert("Captcha solved!");
  }
};

// Check if the captcha has already been completed in this session
onMounted(() => {
  isCompleted.value = sessionStorage.getItem("captchaCompleted") === "true";
});
</script>

<style scoped>
.captcha-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.drop-zone {
  width: 200px;
  height: 200px;
  border: 2px dashed #c61010;
  display: flex;
  align-items: center;
  justify-content: center;
}

.captcha-img {
  width: 150px;
  height: 150px;
}
</style>
