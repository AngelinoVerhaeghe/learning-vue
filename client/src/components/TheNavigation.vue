<script setup lang="ts">
import { useUserStore } from "@/stores/UserStore";
import { computed, onMounted, ref, onBeforeMount, onBeforeUnmount } from "vue";
import router from "@/router";
import { useRoute } from "vue-router";

const userStore = useUserStore();
const route = useRoute();

const user = computed(() => userStore.getUser);
const isOpen = ref(false); // To open/close dropdown
const dropdownRef = ref<HTMLElement | null>(null);

// Ref to the dropdown element for closing it when clicked outside
const onClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

// Check if the current route is active
const isActive = (routeName: string) => {
  return computed(() => route.name === routeName);
};

const toggleUserOptions = (event: MouseEvent) => {
  // Prevent the click event from propagating to the document
  event.stopPropagation();
  isOpen.value = !isOpen.value;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  userStore.logoutUser();
  router.push({ name: "home" });
};

onMounted(() => {
  userStore.initializeUser();
});

// Add event listener to close the dropdown when clicked outside
onBeforeMount(() => {
  document.addEventListener("click", onClickOutside);
});

// Remove event listener when the component is unmounted
onBeforeUnmount(() => {
  document.removeEventListener("click", onClickOutside);
});
</script>

<template>
  <div class="flex items-center justify-between">
    <div>
      <router-link to="/" class="text-xl font-semibold">CodeWave</router-link>
    </div>
    <div class="">
      <ul class="flex items-center space-x-4 px-1 font-medium">
        <li v-if="!user" class="hover:underline-amber-600">
          <router-link :to="{ name: 'register' }"> Register</router-link>
        </li>
        <li v-if="!user" class="">
          <router-link :to="{ name: 'login' }"> Login</router-link>
        </li>
        <li v-if="user" class="group relative overflow-hidden">
          <router-link
            :to="{ name: 'home' }"
            :class="{ 'border-b-2 border-amber-600': isActive('home').value }"
          >
            Home
          </router-link>
          <span
            class="absolute bottom-0 left-0 h-0.5 w-0 bg-amber-600 transition-all duration-300 group-hover:w-full"
          ></span>
        </li>
        <li v-if="user" class="group relative overflow-hidden">
          <router-link
            :to="{ name: 'add_post' }"
            :class="{
              'border-b-2 border-amber-600': isActive('add_post').value,
            }"
          >
            New Post
          </router-link>
          <span
            class="absolute bottom-0 left-0 h-0.5 w-0 bg-amber-600 transition-all duration-300 group-hover:w-full"
          ></span>
        </li>

        <li v-if="user" class="relative flex items-center px-4">
          <button
            type="button"
            @click="toggleUserOptions"
            class="relative flex rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            <span class="absolute -inset-1.5"></span>
            <img
              class="h-8 w-8 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
              alt=""
            />
          </button>
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <ul
              v-show="isOpen"
              ref="dropdownRef"
              class="absolute right-5 top-10 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <li>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700"
                  >Your Profile</a
                >
              </li>
              <li>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700"
                  >Settings</a
                >
              </li>
              <li
                @click="logout"
                class="block cursor-pointer px-4 py-2 text-sm text-gray-700"
              >
                Sign out
              </li>
            </ul>
          </transition>
        </li>
      </ul>
    </div>
  </div>
</template>
