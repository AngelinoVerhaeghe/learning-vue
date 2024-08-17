<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { usePostStore } from "@/stores/PostStore";
import Post from "@/components/Post.vue";
import { ArrowTopRightOnSquareIcon } from "@heroicons/vue/24/solid";
import { useToastHandler } from "@/composables/useToastHandler";
import { useUserStore } from "@/stores/UserStore";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

const postStore = usePostStore();
const userStore = useUserStore();

const isLoading = ref(true);
const numberOfPostsToShow = 3;

useToastHandler();

const user = computed(() => userStore.getUser);
const color = "#f59e0b";

const fetchPosts = async () => {
  await postStore.loadPosts();
  postStore.posts = postStore.posts.slice(0, numberOfPostsToShow);
  isLoading.value = false;
};

onMounted(async () => {
  await fetchPosts();
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
});
</script>

<template>
  <div class="py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <h2
          class="text-3xl font-bold tracking-tight underline decoration-amber-600 sm:text-4xl"
        >
          From the blog
        </h2>
        <p class="mt-2 text-lg leading-8">
          Learn how to grow your business with our expert advice.
        </p>
      </div>
      <div v-if="isLoading" class="my-20 flex items-center justify-center">
        <PulseLoader :loading="isLoading" :color="color" />
      </div>
      <div
        v-else-if="postStore.posts && postStore.posts.length > 0"
        class="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3"
      >
        <Post v-for="post in postStore.posts" :key="post.id" :post="post" />
      </div>
      <div v-else class="my-20">
        <p>No post available at this moment.</p>
        <div v-if="user" class="mt-3 flex space-x-1">
          <ArrowTopRightOnSquareIcon class="h-6 w-6" />
          <router-link
            :to="{ name: 'add_post' }"
            class="hover:underline hover:decoration-amber-600"
          >
            Create New Post
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
