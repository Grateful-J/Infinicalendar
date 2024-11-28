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
}>();

const cardTitle = `Day ${props.day}`;
const cardSubtitle = props.prizeName;

// Function to handle image path
const getImageUrl = () => {
  try {
    return new URL(`../assets/images/holidayVeg.webp`, import.meta.url).href;
  } catch (error) {
    console.error("Error loading image:", error);
    return ""; // Return empty string or a default image path
  }
};
</script>

<style scoped>
.calendar-card {
  width: 200px !important;
  height: 300px !important;
}

:deep(.p-card) {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

:deep(.p-card-body) {
  padding: 0.75rem !important;
  height: calc(100% - 128px);
  display: flex;
  flex-direction: column;
}

:deep(.p-card-title) {
  color: #2c3e50;
  font-family: "Montserrat", sans-serif;
  font-size: 1.1rem;
  margin-bottom: 0.5rem !important;
}

.subtitle-container {
  padding: 0.5rem;
  font-size: 0.9rem;
  color: #34495e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
}

.description-text {
  font-family: "Montserrat", sans-serif;
  color: #2c3e50;
  font-size: 0.9rem;
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
