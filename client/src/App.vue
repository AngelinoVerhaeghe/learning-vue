<script setup lang="ts">
import { RouterView } from "vue-router";
import TheFooter from "@/components/TheFooter.vue";
import TheNavigation from "@/components/TheNavigation.vue";
import { Toaster } from "vue-sonner";
</script>

<template>
  <Toaster richColors position="top-center" closeButton />
  <div class="container mx-auto flex h-screen flex-col justify-between p-6">
    <TheNavigation />
    <main>
      <RouterView />
    </main>
    <TheFooter />
  </div>
</template>
