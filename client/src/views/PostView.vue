<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { usePostStore } from "@/stores/PostStore";
import { PencilIcon, TrashIcon } from "@heroicons/vue/24/solid";
import { formatDate } from "@/composables/useFormatDate";

const postStore = usePostStore();
const route = useRoute();

onMounted(async () => {
  await postStore.getPost(String(route.params.slug));
});

const deletePost = async () => {
  const slug = String(route.params.slug);
  await postStore.deletePost(slug);
};
</script>

<template>
  <div
    class="prose mx-auto my-20 max-w-6xl overflow-hidden rounded-lg text-white shadow"
  >
    <img
      :src="postStore.post?.image"
      class="mb-0 w-full object-cover"
      :alt="postStore.post?.title"
    />

    <div class="flex items-center justify-end space-x-2 p-6">
      <div>
        <router-link :to="{ name: 'edit_post' }">
          <button
            class="rounded-md bg-amber-400 px-4 py-3 text-white transition duration-200 hover:bg-amber-500"
          >
            <PencilIcon class="h-6 w-6" />
          </button>
        </router-link>
      </div>
      <div>
        <button
          @click="deletePost"
          class="rounded-md bg-red-400 px-4 py-3 transition duration-200 hover:bg-red-500"
        >
          <TrashIcon class="h-6 w-6" />
        </button>
      </div>
    </div>

    <div class="flex items-center">
      <p class="m-0">{{ formatDate(postStore.post?.date) }}</p>
      <span class="mx-2.5 h-4 border-2 border-l border-amber-600"></span>
      <p class="m-0">{{ postStore.post?.author.user_name }}</p>
    </div>

    <h1 class="mt-10 text-3xl text-white">{{ postStore.post?.title }}</h1>
    <div>
      <p>{{ postStore.post?.description }}</p>
    </div>
  </div>
</template>
