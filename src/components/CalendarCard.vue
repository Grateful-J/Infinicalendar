<template>
  <Card class="calendar-card relative">
    <template #header>
      <div class="overflow-hidden">
        <div class="absolute top-2 right-2 z-20 opacity-15 hover:opacity-100 transition-opacity duration-300 ease-in-out">
          <ToggleButton
            v-model="isLockedLocal"
            onIcon="pi pi-lock"
            offIcon="pi pi-lock-open"
            @click.stop
            @change="handleLockToggle"
            class="lock-toggle"
          />
        </div>
        <img :src="getImageUrl()" alt="calendar image" class="w-full h-32 object-cover transition-[height] duration-300 ease-in-out hover:h-64" />
      </div>
    </template>
    <template #title>
      <div class="text-lg font-display">{{ prizeName }}</div>
    </template>
    <template #content>
      <ScrollPanel style="width: 100%; height: 100px" class="relative" barY="true">
        <div class="content-container p-4">
          <div class="description-text mb-4">{{ prizeDescription }}</div>
        </div>
        <!-- Calendar Options -->
        <a v-if="prizeUrl" :href="prizeUrl" target="_blank" class="learn-more-link mt-4 inline-block"> Add to Calendar </a>
      </ScrollPanel>

      <!-- Fixed Day Number -->
      <div class="day-number">
        <span class="text-3xl font-bold text-yellow-300 christmas-glow opacity-30 hover:opacity-100 transition-opacity duration-300 ease-in-out">{{
          day
        }}</span>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import Card from "primevue/card";
import ScrollPanel from "primevue/scrollpanel";
import ToggleButton from "primevue/togglebutton";

const props = defineProps<{
  day: number;
  prizeName?: string;
  prizeDescription?: string;
  prizeUrl?: string;
  doorStatus: boolean;
  image?: string;
  iframe?: string;
  isLocked: boolean;
}>();

const emit = defineEmits(["toggle-lock"]);

const showCalendar = ref(false);
const isLockedLocal = ref(props.isLocked);

watch(
  () => props.isLocked,
  (newValue) => {
    isLockedLocal.value = newValue;
  }
);

// Function to handle image path
const getImageUrl = () => {
  try {
    return new URL(`../assets/images/${props.image}`, import.meta.url).href;
  } catch (error) {
    console.error("Error loading image:", error);
    return "";
  }
};

const handleLockToggle = (event: Event) => {
  event.stopPropagation();
  emit("toggle-lock");
};
</script>

<style scoped>
.calendar-card {
  width: 100% !important;
  height: 100% !important;
}

.day-number {
  position: absolute;
  bottom: 0.5rem;
  right: 0.2rem;
  padding: 0.5rem 0.5rem;
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 10;
}

.lock-toggle {
  :deep(.p-button) {
    width: 2rem !important;
    height: 1.75rem !important;
    background: rgba(0, 0, 0, 0.6) !important;
    border: none !important;
    backdrop-filter: blur(4px);

    &:hover {
      background: rgba(0, 0, 0, 0.7) !important;
    }

    /* Hide the label text */
    .p-button-label {
      display: none;
    }

    /* Style the icons */
    .pi {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.9);
    }

    /* Optional: Add transition for smooth toggle */
    transition: background-color 0.2s ease;
  }

  /* Style the checked state */
  :deep(.p-button.p-highlight) {
    background: rgba(59, 130, 246, 0.6) !important;

    &:hover {
      background: rgba(59, 130, 246, 0.7) !important;
    }
  }
}

/* Ensure the toggle button container doesn't interfere with clicks */
.lock-toggle-container {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 20;
}

:deep(.p-card) {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
}

:deep(.p-scrollpanel) {
  .p-scrollpanel-wrapper {
    border-radius: 8px;
  }
  .p-scrollpanel-bar {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
}

/* Optional: Add some glow to the day number */
.christmas-glow {
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3), 0 0 20px rgba(255, 215, 0, 0.2);
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
