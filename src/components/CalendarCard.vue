<template>
  <Card class="calendar-card">
    <template #header>
      <img :src="getImageUrl()" alt="calendar image" class="w-full h-32 object-cover" />
    </template>
    <template #title>
      <div class="text-lg font-display">{{ cardTitle }}</div>
    </template>
    <template #subtitle>
      <div class="subtitle-container">
        <span class="font-display">{{ prizeName }}</span>
      </div>
    </template>
    <template #content>
      <div class="content-container">
        <div class="description-text">{{ prizeDescription }}</div>
        <a v-if="prizeUrl" :href="prizeUrl" class="learn-more-link"> Learn More </a>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from "primevue/card";
//import { onMounted } from "vue";

const props = defineProps<{
  day: number;
  prizeName?: string;
  prizeDescription?: string;
  prizeUrl?: string;
  doorStatus: boolean;
  image?: string;
}>();

const cardTitle = `Day ${props.day}`;
const cardSubtitle = props.prizeName;

// Function to handle image path
const getImageUrl = () => {
  try {
    console.log(`Hey! Were you looking for this image? ${props.image}`);
    return new URL(`../assets/images/${props.image}`, import.meta.url).href;
  } catch (error) {
    console.error("Error loading image:", error);
    return "";
  }
};
</script>

<style scoped>
.calendar-card {
  width: 100% !important;
  height: 100% !important;
  min-height: 200px;
  max-height: 300px;
}

:deep(.p-card) {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

:deep(.p-card-body) {
  padding: 0.75rem !important;
  height: calc(100% - 128px);
  display: flex;
  flex-direction: column;
}

:deep(.p-card-title) {
  color: white;
  font-family: "Montserrat", sans-serif;
  font-size: clamp(0.8rem, 2.5vw, 0.9rem);
  margin-bottom: 0.25rem !important;
  text-align: center;
}

.subtitle-container {
  padding: 0.25rem;
  font-size: clamp(0.9rem, 2.5vw, 1rem);
  color: white;
  white-space: start;
  overflow: auto;
  text-overflow: inherit;
  font-family: "Montserrat", sans-serif;
}

.content-container {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  height: 100%;
  overflow-y: scroll;
  color: white;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.content-container::-webkit-scrollbar {
  width: 6px;
}

.content-container::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.description-text {
  font-family: "Montserrat", sans-serif;
  color: white;
  font-size: clamp(0.8rem, 2.5vw, 0.9rem);
  line-height: 1.4;
}

.learn-more-link {
  color: #2c3e50;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s;
}

.learn-more-link:hover {
  color: #16a34a;
}
</style>
