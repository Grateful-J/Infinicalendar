<template>
  <Card style="width: 25rem; overflow: hidden" class="border-2 border-green-600">
    <template #header> <img :src="cardImage" alt="" /> </template>
    <template #title>{{ cardTitle }}</template>
    <template #subtitle>{{ cardSubtitle }}</template>
    <template #content>
      <p class="m-0">
        {{ cardContent }}
      </p>
    </template>

    <template #footer>
      <Button label="Open" class="w-full" @click="toggleDoor(day)"> Open Door </Button>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from "primevue/card";
import { onMounted, ref } from "vue";
import Button from "primevue/button";
//import { useStore } from "vuex";

const cardTitle = ref("Card Titlez");
const cardSubtitle = ref("Card Subtitle");
const cardContent = ref("Card Content");
const cardImage = ref("Card Image");

//cardImage.value = "../assets/images/holidayVeg.webp";

const props = defineProps({
  day: Number,
  openedDoors: Array,
  doorOpened: Boolean,
  dateLocked: Boolean,
  hoverEffect: Function,
  openDoorEffect: Function,
  toggleDoor: Function,
  cardTitle: String,
});

onMounted(() => {
  console.log(`day is: ${props.day}`);
  console.log(`doorOpened is: ${props.doorOpened}`);
  console.log(`openedDoors is: ${props.openedDoors}`);
  console.log(`dateLocked is: ${props.dateLocked}`);

  cardTitle.value = `Day ${props.day}`;
  cardSubtitle.value = `Door Open Status: ${props.doorOpened ? "OPEN" : "CLOSED"}`;
  cardContent.value = `Day ${props.day} Card Content`;
  cardImage.value = `../assets/images/holidayVeg.webp`;
});
</script>
