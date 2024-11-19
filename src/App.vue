<template>
  <div class="relative min-h-screen bg-gradient-to-b from-blue-900 to-gray-900">
    <!-- Snowfall -->
    <div v-show="!snakeyDon" class="absolute inset-0 pointer-events-none" id="snow"></div>
    <div v-show="snakeyDon" class="absolute inset-0 pointer-events-none" id="snake"></div>

    <!-- Header -->
    <div class="text-center py-10">
      <h1 class="text-6xl font-extrabold text-yellow-300 drop-shadow-md glow">Christmas Advent Calendar</h1>
      <p class="mt-4 text-lg text-gray-200 font-medium">Unlock the calendars of the season, one day at a time!</p>
    </div>

    <Card style="width: 25rem; overflow: hidden">
      <template #header>
        <img alt="user header" src="./assets/images/holidayVeg.webp" />
      </template>
      <template #title>Advanced Card</template>
      <template #subtitle>Card subtitle</template>
      <template #content>
        <p class="m-0">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat
          libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
        </p>
      </template>
      <template #footer>
        <div class="flex gap-4 mt-1">
          <Button label="Cancel" severity="secondary" outlined class="w-full" />
          <Button label="Save" class="w-full" />
        </div>
      </template>
    </Card>

    <!-- Advent Calendar Grid -->
    <div class="grid grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 gap-6 max-w-7xl mx-auto mt-12 px-4">
      <div v-for="day in 24" :key="day" class="relative group cursor-pointer transition-transform transform hover:scale-105">
        <div
          class="door bg-red-600 min-h-[150px] rounded-lg shadow-2xl relative"
          :class="{
            'bg-gradient-to-tl from-blue-800 to-green-800 ':
              openedDoors.some((door) => door.day === day) && openedDoors.find((door) => door.day === day)?.doorStatus === true,
          }"
        >
          <!-- Number -->
          <div
            class="absolute inset-0 flex items-center justify-center text-5xl font-bold text-white"
            v-show="!openedDoors.some((door) => door.day === day)"
          >
            {{ day }}
          </div>

          <!-- Displays Card Info-->
          <div class="absolute inset-0 flex flex-col items-center justify-between font-bold text-white">
            <span v-show="openedDoors.some((door) => door.day === day)" class="text-2xl">
              {{ openedDoors.find((door) => door.day === day)?.prizeName }}</span
            >
            <span v-show="doorOpened" class="text-xl"> {{ openedDoors.find((door) => door.day === day)?.prizeDescription }}</span>
            <span v-show="doorOpened" class="text-lg"> {{ openedDoors.find((door) => door.day === day)?.prizeURL }}</span>
            <span v-show="doorOpened" class="text-lg"> {{ openedDoors.find((door) => door.day === day)?.doorStatus }}</span>
          </div>
        </div>
        <!-- Glow Effect -->
        <div
          class="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-400 to-red-400 opacity-0 group-hover:opacity-100"
          style="filter: blur(5px)"
          @mouseover="hoverEffect(day)"
          @click="openDoorEffect(day)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="App">
import { ref, onMounted, computed } from "vue";
import adventPrizes from "./utils/adventPrizes";
import Card from "primevue/card";

const snowflakeCount = `${Math.floor(Math.random() * 100) + 10}`;

const generateSnowflakes = () => {
  console.log(`generating snowflakes.....  `);
  const snowContainer = document.getElementById("snow");
  const snakeFlakeContainer = document.getElementById("snake");
  for (let i = 0; i < snowflakeCount; i++) {
    const snowflake = document.createElement("div");

    snowflake.classList.add("snowflake");
    // add snowflake emoji
    snowflake.innerHTML = "❄️";
    snowflake.style.left = `${Math.random() * 100}%`;
    snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`;
    snowflake.style.animationDelay = `${Math.random() * 5}s`;
    snowflake.classList.add("text-3xl");
    snowContainer.appendChild(snowflake);

    const snakeflake = document.createElement("div");
    snakeflake.classList.add("snakeflake");
    snakeflake.innerHTML = "🐍";
    snakeflake.classList.add("text-4xl");
    snakeflake.style.left = `${Math.random() * 100}%`;
    snakeflake.style.animationDuration = `${Math.random() * 3 + 2}s`;
    snakeflake.style.animationDelay = `${Math.random() * 5}s`;
    //flip snake across y axis
    const snakeDirection = Math.random() < 0.5 ? "left" : "right";
    console.log(snakeDirection);
    //transform: 'scaleX(-1)' if direction is right
    snakeFlakeContainer.appendChild(snakeflake);
  }
};

// generate snowflakes
onMounted(() => {
  generateSnowflakes();
});

const hoverEffect = (day) => {
  //console.log(`Hovered over day ${day}!`);
};

const doorOpened = ref(false);
const openedDoors = ref([]);
const dateLocked = ref(false); // used in dev to toggle if doors can open if date is later than today
const date = ref(new Date().getDate()); // formatted to only show day of month
console.log(`date is: ${date.value}`);

// Trigger on Snakey Don Calender
const snakeyDon = ref(false);

const toggleDoor = (day) => {
  //doorOpened.value = !doorOpened.value;
  const door = openedDoors.value.find((door) => door.day === day);
  door.doorStatus = !door.doorStatus;

  openedDoors.value.find((door) => door.doorStatus === true) ? (doorOpened.value = true) : (doorOpened.value = false);
  console.log(`The Door is ${door.day}`);
  console.log(`The Door Status is: ${door.doorStatus ? "OPEN" : "CLOSED"}`);
};
const openDoorEffect = (day) => {
  //console.log(`Opened door for day ${day}!`);
  const prize = adventPrizes[day - 1];
  if (prize) {
    //console.log(`post-Click Door Status: ${doorOpened.value}`);
    const prizeName = prize.name;
    const prizeDescription = prize.description;
    const prizeImage = prize.image;
    const prizeJson = prize.json;
    let doorStatus = false;
    const prizeURL = prize.url;
    console.log(day);
    openedDoors.value.push({ day, prizeName, prizeDescription, prizeImage, prizeJson, prizeURL, doorStatus });
    console.log(openedDoors.value);

    //alert(prize.name + ": " + prize.description);
    //toggleDoor(day);

    // Checks to see if date is later than today
    if (day <= date.value) {
      toggleDoor(day);
    } else alert("Door is locked! Come back tomorrow");

    return prizeName, prizeDescription;
  }
};
</script>
