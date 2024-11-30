<template>
  <div class="relative min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 p-4 sm:p-8">
    <!-- Snowflakes -->
    <div class="snowflakes"></div>
    <div class="snowflakes" aria-hidden="true"></div>

    <!-- Header -->
    <div class="text-center py-6 sm:py-10">
      <h1 class="text-4xl sm:text-6xl font-extrabold text-yellow-300 drop-shadow-md glow">Christmas Advent Calendar</h1>
      <p class="mt-2 sm:mt-4 text-base sm:text-lg text-gray-200">Open a new surprise each day!</p>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 max-w-7xl mx-auto">
      <div v-for="day in 24" :key="day" class="relative group">
        <!-- Gift Box Container -->
        <div
          class="door aspect-square bg-red-600 rounded-lg shadow-xl cursor-pointer transform transition-transform duration-500"
          :class="{ opened: currentDoorForDay(day)?.doorStatus }"
          @click="openDoorEffect(day)"
          :data-day="day"
        >
          <div class="ribbon-horizontal"></div>
          <div class="ribbon-vertical"></div>
          <div class="bow"></div>
          <!-- Front of Door (Day Number) -->
          <div v-show="!currentDoorForDay(day)?.doorStatus" class="absolute inset-0 flex items-center justify-center">
            <div class="text-5xl font-bold text-white">{{ day }}</div>
            <!-- Christmas Decoration -->
            <div class="absolute top-2 left-2 w-8 h-8 border-2 border-gold rounded-full"></div>
            <div class="absolute bottom-2 right-2 w-8 h-8 border-2 border-gold rounded-full"></div>
          </div>

          <!-- Back of Door (Calendar Card) -->
          <div v-show="currentDoorForDay(day)?.doorStatus" class="absolute inset-0 backface-hidden">
            <CalendarCard
              :day="day"
              :prize-name="currentDoorForDay(day)?.prizeName"
              :prize-description="currentDoorForDay(day)?.prizeDescription"
              :prize-url="currentDoorForDay(day)?.prizeURL"
              :door-status="currentDoorForDay(day)?.doorStatus || false"
              :image="currentDoorForDay(day)?.image"
            />
          </div>

          <!-- Hover Glow Effect -->
          <div
            class="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-400 to-red-400 opacity-0 group-hover:opacity-20"
            style="filter: blur(5px)"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import CalendarCard from "./components/CalendarCard.vue";
//import adventPrizes from "./utils/adventPrizes";
import adventPrizes from "./utils/secretCals";

// Define the type for door objects
interface Door {
  day: number;
  doorStatus: boolean;
  prizeName: string;
  prizeDescription: string;
  prizeURL?: string;
}

// Initialize openedDoors as a ref with the Door type
const openedDoors = ref<Door[]>([]);

const snakeyDon = ref(false);

// Function to handle door opening
const openDoorEffect = (day: number) => {
  const existingDoor = openedDoors.value.find((door) => door.day === day);
  if (!existingDoor) {
    // Get random prize from adventPrizes
    //const prize = adventPrizes[Math.floor(Math.random() * adventPrizes.length)];

    // Present prizes in original order
    const prize = adventPrizes[day];

    // Add new door to openedDoors
    openedDoors.value.push({
      day,
      doorStatus: true,
      prizeName: prize.name,
      prizeDescription: prize.description,
      prizeURL: prize.url,
      image: prize.image,
    });

    if (day === 5) {
      snakeyDon.value = true;
      generateSnowflakes();
    }

    // Remove bow and ribbon elements when door is opened
    const doorElement = document.querySelector(`[data-day="${day}"]`);
    if (doorElement) {
      const bowElement = doorElement.querySelector(".bow");
      const ribbonElement = doorElement.querySelector(".ribbon-horizontal");
      //remove vertical door element
      const verticalDoorElement = doorElement.querySelector(".robbon-vertical");

      if (bowElement) bowElement.remove();
      if (ribbonElement) ribbonElement.remove();
      if (verticalDoorElement) verticalDoorElement.remove();
    }
  } else {
    // Close Door and remove from openedDoors
    existingDoor.doorStatus = false;
    openedDoors.value = openedDoors.value.filter((door) => door.day !== day);
  }
};

// Generate random snowflakes
const generateSnowflakes = () => {
  const snowflakesContainers = document.querySelectorAll(".snowflakes");

  snowflakesContainers.forEach((container) => {
    const snowflakeCount = Math.floor(Math.random() * 10) + 10;

    for (let i = 0; i < snowflakeCount; i++) {
      const snowflake = document.createElement("div");
      //const snowflakeSize = Math.floor(Math.random() * 10) + 400;

      snowflake.classList.add("snowflake");
      //snowflake.style.width = `${snowflakeSize}px`;
      //snowflake.style.height = `${snowflakeSize}px`;

      snowflake.classList.add("text-4xl");

      snowflake.textContent = snakeyDon.value ? "🐍" : "❄️";

      // Add random position and animation
      snowflake.style.left = `${Math.random() * 100}%`;
      snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`; // Random duration between 2-5s
      snowflake.style.animationDelay = `${Math.random() * 2}s`; // Random delay start

      container.appendChild(snowflake);
    }
  });
};

onMounted(() => {
  generateSnowflakes();
});

// Function to get current door info
const currentDoorForDay = (day: number) => {
  return openedDoors.value.find((door) => door.day === day);
};
</script>

<style scoped>
.door {
  width: 100%;
  height: auto;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s ease-in-out;
  background: linear-gradient(45deg, #dc2626, #ef4444);
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Present wrapping pattern */
.door::before {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.2) 0px, rgba(255, 255, 255, 0.2) 10px, transparent 10px, transparent 20px);
  border-radius: 8px;
}

/* Vertical ribbon 
//.door::after {
*/

.door .ribbon-vertical {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

/* Horizontal ribbon */
.door .ribbon-horizontal {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 20px;
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

/* Bow */
.door .bow {
  position: absolute;
  top: calc(50% - 15px);
  left: calc(50% - 15px);
  width: 30px;
  height: 30px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  box-shadow: -20px -10px 0 -8px rgba(255, 255, 255, 0.4), 20px -10px 0 -8px rgba(255, 255, 255, 0.4);
  z-index: 1;
}

.door.opened {
  transform: rotateY(180deg);
}

.backface-hidden {
  backface-visibility: hidden;
  transform: rotateY(180deg);
}

.glow {
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.snowflake {
  position: absolute;
  top: -20px;
  animation: snowfall linear infinite;
}

@keyframes snowfall {
  0% {
    transform: translateY(-20px) rotate(0deg);
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
  }
}
</style>
