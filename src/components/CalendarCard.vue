<template>
  <Card class="calendar-card relative" :class="{ 'mobile-expanded': isMobileExpanded }" @click="handleCardClick">
    <template #header>
      <div class="overflow-hidden">
        <div class="absolute top-2 right-2 z-20 opacity-85 hover:opacity-100">
          <button
            @click.stop="handleLockToggle"
            class="p-2 rounded-full bg-opacity-60 backdrop-blur-sm hover:bg-opacity-100"
            :class="isLockedLocal ? 'bg-red-500' : 'bg-green-500'"
          >
            <span class="text-white">
              {{ isLockedLocal ? "🔒" : "🔓" }}
            </span>
          </button>
        </div>
        <img :src="getImageUrl()" alt="calendar image" class="w-full h-32 object-cover transition-[height] duration-300 ease-in-out hover:h-64" />
      </div>
    </template>
    <template #title>
      <div class="text-lg font-display">{{ prizeName }}</div>
    </template>
    <template #content>
      <ScrollPanel
        style="width: 100%; height: 75px"
        class="relative hover:scale-105 transition-transform duration-300 ease-in-out"
        :pt="{
          root: { class: 'relative' },
          contentContainer: { class: 'p-4' },
          barY: {
            style: 'background-color: #22c55e !important; width: 8px !important; border-radius: 9999px !important',
          },
        }"
      >
        <div class="content-container p-4">
          <div class="description-text mb-4">{{ prizeDescription }}</div>
        </div>
        <!-- Calendar Options -->
        <div class="flex justify-center">
          <button
            v-if="prizeUrl"
            class="calendar-btn px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 backdrop-blur-sm"
            @click.stop="openCalendarUrl"
          >
            <span class="calendar-icon">📅</span>
            <span class="whitespace-nowrap">Add to Calendar</span>
          </button>
        </div>
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

const emit = defineEmits(["toggle-lock", "click"]);

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

const handleLockToggle = () => {
  isLockedLocal.value = !isLockedLocal.value;
  emit("toggle-lock");
};

const isMobileExpanded = ref(false);

const handleCardClick = () => {
  if (!isLockedLocal.value) {
    if (window.innerWidth < 640) {
      isMobileExpanded.value = !isMobileExpanded.value;
    } else {
      emit("click");
    }
  }
};

const openCalendarUrl = () => {
  if (props.prizeUrl) {
    window.open(props.prizeUrl, "_blank");
  }
};
</script>

<style scoped>
.calendar-card {
  width: 100% !important;
  height: 100% !important;
  transition: all 0.3s ease;
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

button {
  transition: all 0.3s ease;
}

button:hover {
  transform: scale(1.1);
}

button:active {
  transform: scale(0.95);
}

.calendar-btn {
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.1);
  transform-origin: center;
  position: relative;
  overflow: hidden;
}

.calendar-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: 0.5s;
}

.calendar-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
}

.calendar-btn:hover::before {
  left: 100%;
}

.calendar-btn:active {
  transform: scale(0.95);
}

.calendar-icon {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

/* Backup approach using deep selectors */
:deep(.p-scrollpanel) {
  .p-scrollpanel-bar-y {
    background-color: #22c55e !important;
    width: 8px !important;
    border-radius: 9999px !important;
  }
}

/* Alternative approach using direct CSS custom properties */
:deep(.p-scrollpanel-bar-y) {
  --scrollbar-color: #22c55e;
  background: var(--scrollbar-color) !important;
  width: 8px !important;
  border-radius: 9999px !important;
}

/* Mobile expanded state */
.mobile-expanded {
  @media (max-width: 640px) {
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    width: 90vw !important;
    height: auto !important;
    max-height: 90vh !important;
    z-index: 99999 !important;
    overflow-y: auto;
    box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.75);
  }

  :deep(.p-card) {
    height: 100%;
  }

  :deep(img) {
    height: 200px !important;
  }

  :deep(.p-scrollpanel) {
    height: auto !important;
    max-height: 300px !important;
  }
}

/* Add backdrop when card is expanded */
.mobile-expanded::before {
  @media (max-width: 640px) {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.75);
    z-index: -1;
  }
}

/* Add a close button for mobile expanded state */
.mobile-expanded::after {
  @media (max-width: 640px) {
    content: "×";
    position: absolute;
    top: 10px;
    right: 10px;
    width: 30px;
    height: 30px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    cursor: pointer;
    z-index: 100000;
  }
}
</style>
