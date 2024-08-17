<script setup lang="ts">
import type { Post } from "@/types/Post";
import { formatDate } from "@/composables/useFormatDate";

defineProps<{
  post: Post;
}>();
</script>

<template>
  <article
    v-if="post.isPublished"
    class="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
  >
    <img
      :src="post.image"
      :alt="post.title"
      class="absolute inset-0 -z-10 h-full w-full object-cover"
    />
    <div
      class="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40"
    />
    <div
      class="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10"
    />

    <div
      class="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300"
    >
      <span class="mr-8">{{ formatDate(post.date) }}</span>
      <div class="-ml-4 flex items-center gap-x-4">
        <svg
          viewBox="0 0 2 2"
          class="-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50"
        >
          <circle cx="1" cy="1" r="1" />
        </svg>
        <div class="flex gap-x-2.5">
          <img
            :src="post.image"
            :alt="post.title"
            class="h-6 w-6 flex-none rounded-full bg-white/10"
          />
          {{ post.author.user_name }}
        </div>
      </div>
    </div>

    <h3 class="mt-3 text-lg font-semibold leading-6 text-white">
      <router-link :to="{ name: 'post', params: { slug: post.slug } }">
        <span class="absolute inset-0" />
        {{ post.title }}
      </router-link>
    </h3>
  </article>
</template>
