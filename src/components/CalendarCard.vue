<template>
  <Card style="width: 25rem; overflow: hidden">
    <template #header>
      <img alt="user header" src="./assets/images/holidayVeg.webp" />
    </template>
    <template #title>{{ cardTitle }}</template>
    <template #subtitle>{{Card subtitle}}</template>
    <template #content>
      <p class="m-0">
        {{ cardContent }}
      </p>
    </template>
    <template #footer>
      <div class="flex gap-4 mt-1">
        <Button label="Cancel" severity="secondary" outlined class="w-full" />
        <Button label="Save" class="w-full" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from "primevue/card";
import Button from "primevue/button";

const cardTitle = ref("Card Title");
const cardSubtitle = ref("Card Subtitle");
const cardContent = ref("Card Content");
</script>
