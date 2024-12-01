<template>
  <div class="relative min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 p-4 sm:p-8">
    <!-- Snowflakes -->
    <div class="snowflakes"></div>
    <div class="snowflakes" aria-hidden="true"></div>

    <!-- Header -->
    <div class="text-center py-6 sm:py-10">
      <h1 class="text-4xl sm:text-6xl font-extrabold text-yellow-300 drop-shadow-md christmas-glow">Christmas "Google Calendar" Advent Calendar</h1>
      <p class="mt-2 sm:mt-4 text-base sm:text-lg text-gray-200">Open a new surprise each day!</p>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 max-w-7xl mx-auto">
      <div v-for="day in 24" :key="day" class="relative group">
        <!-- Gift Box Container -->
        <div
          class="door aspect-square bg-red-600 rounded-lg shadow-xl cursor-pointer transform transition-transform duration-500"
          :class="{
            opened: currentDoorForDay(day)?.doorStatus,
            invisible: isMobileView && expandedDay === day,
          }"
          @click="(event) => handleDoorClick(event, day)"
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
          <div v-show="currentDoorForDay(day)?.doorStatus" class="absolute inset-0 backface-hidden scroll-smooth">
            <CalendarCard
              :day="day"
              :prize-name="currentDoorForDay(day)?.prizeName"
              :prize-description="currentDoorForDay(day)?.prizeDescription"
              :prize-url="currentDoorForDay(day)?.prizeURL"
              :door-status="currentDoorForDay(day)?.doorStatus || false"
              :image="currentDoorForDay(day)?.image"
              :is-locked="currentDoorForDay(day)?.isLocked || true"
              @toggle-lock="toggleDoorLock(day)"
              @click="handleCardClick(day)"
            />
          </div>

          <!-- Hover Glow Effect -->
          <div
            class="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-400 to-red-400 opacity-0 group-hover:opacity-20 pointer-events-none"
            style="filter: blur(5px)"
          ></div>
        </div>
      </div>
    </div>

    <!-- Mobile Expanded Card Container -->
    <Teleport to="body">
      <div v-if="expandedDay" class="fixed inset-0 z-[9999] flex items-center justify-center">
        <div class="absolute inset-0 bg-black bg-opacity-75" @click="expandedDay = null"></div>
        <div class="relative w-[90vw] max-w-lg z-[10000]">
          <CalendarCard
            v-if="currentDoorForDay(expandedDay)"
            :day="expandedDay"
            :prize-name="currentDoorForDay(expandedDay)?.prizeName"
            :prize-description="currentDoorForDay(expandedDay)?.prizeDescription"
            :prize-url="currentDoorForDay(expandedDay)?.prizeURL"
            :door-status="currentDoorForDay(expandedDay)?.doorStatus || false"
            :image="currentDoorForDay(expandedDay)?.image"
            :is-locked="currentDoorForDay(expandedDay)?.isLocked || true"
            @toggle-lock="toggleDoorLock(expandedDay)"
            @click="handleCardClick(expandedDay)"
          />
          <button
            @click="expandedDay = null"
            class="absolute -top-4 -right-4 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center"
          >
            ×
          </button>
        </div>
      </div>
    </Teleport>
    <GreetingPopup v-show="showGreetingPopup" />
    <CaptchaCheck v-show="!captchaCompleted" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import CalendarCard from "./components/CalendarCard.vue";
//import adventPrizes from "./utils/adventPrizes";
import adventPrizes from "./utils/secretCals";
import GreetingPopup from "./components/GreetingPopup.vue";
import CaptchaCheck from "./components/CaptchaCheck.vue";

// Define the type for door objects
interface Door {
  day: number;
  doorStatus: boolean;
  isLocked: boolean;
  prizeName: string;
  prizeDescription: string;
  prizeURL?: string;
  image?: string;
}

// Initialize openedDoors as a ref with the Door type
const openedDoors = ref<Door[]>([]);

const snakeyDon = ref(false);

const showGreetingPopup = ref(false);

const captchaCompleted = ref(false);

const expandedDay = ref<number | null>(null);
const isMobileView = ref(window.innerWidth < 640);

// Session storage for openedDoors
const sessionStorageKey = sessionStorage.getItem("openedDoors") || "[]";
openedDoors.value = JSON.parse(sessionStorageKey);

// Function to handle door opening
const openDoorEffect = (day: number) => {
  const existingDoor = openedDoors.value.find((door) => door.day === day);
  if (!existingDoor) {
    const prize = adventPrizes[day];
    openedDoors.value.push({
      day,
      doorStatus: true,
      isLocked: true,
      prizeName: prize.name,
      prizeDescription: prize.description,
      prizeURL: prize.url,
      image: prize.image,
    });
    sessionStorage.setItem("openedDoors", JSON.stringify(openedDoors.value));

    // Remove bow and ribbon elements when door is opened
    const doorElement = document.querySelector(`[data-day="${day}"]`);
    if (doorElement) {
      const bowElement = doorElement.querySelector(".bow");
      const ribbonElement = doorElement.querySelector(".ribbon-horizontal");
      //remove vertical door element
      const verticalDoorElement = doorElement.querySelector(".ribbon-vertical");

      if (bowElement) bowElement.remove();

      if (ribbonElement) ribbonElement.remove();
      if (verticalDoorElement) verticalDoorElement.remove();

      // If it's the 5th day, make the snowflakes snakey
      if (day === 5 && !snakeyDon.value) {
        snakeyDon.value = true;
        generateSnowflakes();
      } else if (day === 5 && snakeyDon.value) {
        snakeyDon.value = false;
        generateSnowflakes();
      }
    }
  } else if (!existingDoor.isLocked) {
    alert("this is locked");
    existingDoor.doorStatus = false;
    openedDoors.value = openedDoors.value.filter((door) => door.day !== day);
    sessionStorage.setItem("openedDoors", JSON.stringify(openedDoors.value));
  }
};

// Generate random snowflakes
const generateSnowflakes = () => {
  const snowflakesContainers = document.querySelectorAll(".snowflakes");

  snowflakesContainers.forEach((container) => {
    // Keep existing snowflakes
    const existingFlakes = container.querySelectorAll(".snowflake");

    // Gradually fade out snowflakes that need to be removed
    existingFlakes.forEach((flake) => {
      if ((snakeyDon.value && flake.textContent === "🐍") || (!snakeyDon.value && flake.textContent === "❄️")) {
        // Keep these flakes
        return;
      }

      // Fade out others
      flake.classList.add("opacity-0");
      setTimeout(() => flake.remove(), 1000);
    });

    // Add new snowflakes
    const snowflakeCount = Math.floor(Math.random() * 10) + 10;

    for (let i = 0; i < snowflakeCount; i++) {
      const snowflake = document.createElement("div");
      const snowflakeSize = Math.floor(Math.random() * 10) + 11;

      snowflake.classList.add("snowflake");
      snowflake.style.opacity = "0"; // Start invisible

      // Set size classes based on snowflakeSize
      if (snowflakeSize < 14) {
        snowflake.classList.add("text-xs");
      } else if (snowflakeSize > 18) {
        snowflake.classList.add("text-6xl");
      } else {
        snowflake.classList.add("text-2xl");
      }

      // Set the emoji based on snakeyDon value
      if (snakeyDon.value) {
        // When snakes are active, 50% chance for each type
        snowflake.textContent = Math.random() > 0.5 ? "🐍" : "❄️";
      } else {
        // When snakes are inactive, only snowflakes
        snowflake.textContent = "❄️";
      }

      // Add random position and animation
      snowflake.style.left = `${Math.random() * 100}%`;
      snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`;
      snowflake.style.animationDelay = `${Math.random() * 2}s`;

      container.appendChild(snowflake);

      // Fade in after a short delay
      setTimeout(() => {
        snowflake.style.opacity = "1";
      }, Math.random() * 500);
    }
  });
};

const captchaChecker = () => {
  // Check if captcha is completed
  const captchaCompletedSession = sessionStorage.getItem("captchaCompleted");
  console.log("captchaCompletedSession", captchaCompletedSession);

  // TODO: Reinstate this when we have new captchas
  // captchaCompleted.value = captchaCompletedSession === "true" ? true : false;

  // TODO: Add new captchas for each week with a new twist
  // for now, defaulting to true
  captchaCompleted.value = true;
};

onMounted(() => {
  generateSnowflakes();

  // Remove bow and ribbon elements for previously opened doors
  openedDoors.value.forEach((door) => {
    const doorElement = document.querySelector(`[data-day="${door.day}"]`);
    if (doorElement) {
      const bowElement = doorElement.querySelector(".bow");
      const ribbonElement = doorElement.querySelector(".ribbon-horizontal");
      const verticalRibbonElement = doorElement.querySelector(".ribbon-vertical");

      if (bowElement) bowElement.remove();
      if (ribbonElement) ribbonElement.remove();
      if (verticalRibbonElement) verticalRibbonElement.remove();
    }
  });

  if (openedDoors.value.length < 1) {
    showGreetingPopup.value = true;
  }
  sessionStorage.setItem("openedDoors", JSON.stringify(openedDoors.value));
  console.log("openedDoors", openedDoors.value);

  // Check if captcha is completed
  captchaChecker();
});

// Function to get current door info
const currentDoorForDay = (day: number) => {
  return openedDoors.value.find((door) => door.day === day);
};

// Locks door if the day is in the future
const lockDoorIfFuture = (day: number) => {
  const currentDate = new Date().getDate();
  return day > currentDate;
};

// Function to toggle door lock
const toggleDoorLock = (day: number) => {
  console.log("Toggle lock clicked, day:", day); // Debug log
  const door = openedDoors.value.find((d) => d.day === day);
  if (door) {
    door.isLocked = !door.isLocked;
    sessionStorage.setItem("openedDoors", JSON.stringify(openedDoors.value));
  }
};

// Update isMobileView on window resize
window.addEventListener("resize", () => {
  isMobileView.value = window.innerWidth < 640;
});

// Modify handleDoorClick
const handleDoorClick = (event: Event, day: number) => {
  if (lockDoorIfFuture(day)) {
    if (day === 5) {
      alert("HISS! 🐍HISS!🐍  I'd be careful of opening that door! Come back another day!");
    } else {
      alert(`Door ${day} is locked! Come back on ${new Date(new Date().setDate(day)).toLocaleDateString()}`);
    }
    return;
  }

  const toggleSwitch = (event.target as HTMLElement)?.closest(".p-toggleswitch");
  if (!toggleSwitch) {
    if (currentDoorForDay(day)?.isLocked) return;

    if (isMobileView.value) {
      openDoorEffect(day);
      expandedDay.value = day;
    } else {
      openDoorEffect(day);
    }
  }
};

// Modify handleCardClick
const handleCardClick = (day: number) => {
  const door = currentDoorForDay(day);
  if (door && !door.isLocked) {
    if (!isMobileView.value) {
      door.doorStatus = false;
      openedDoors.value = openedDoors.value.filter((d) => d.day !== day);
      sessionStorage.setItem("openedDoors", JSON.stringify(openedDoors.value));
    }
    // On mobile, clicking the card does nothing (closing is handled by the overlay/close button)
  }
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

.christmas-glow {
  animation: glowPulse 2s ease-in-out infinite;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3), 0 0 20px rgba(232, 127, 8, 0.3), 0 0 30px rgba(255, 215, 0, 0.3);
}

@keyframes glowPulse {
  0% {
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.3), 0 0 20px rgba(255, 215, 0, 0.3), 0 0 30px rgba(255, 215, 0, 0.3);
  }
  50% {
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.5), 0 0 30px rgba(204, 76, 12, 0.791), 0 0 40px rgba(255, 215, 0, 0.5), 0 0 50px rgba(255, 215, 0, 0.3);
  }
  100% {
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.3), 0 0 20px rgba(220, 36, 4, 0.3), 0 0 30px rgba(255, 215, 0, 0.3);
  }
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

.invisible {
  visibility: hidden;
}
</style>
