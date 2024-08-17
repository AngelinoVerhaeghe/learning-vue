<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/UserStore";
import { useToastStore } from "@/stores/ToastStore";
import { useRouter } from "vue-router";
import { useToastHandler } from "@/composables/useToastHandler";

useToastHandler();

const router = useRouter();
const userStore = useUserStore();
const toastStore = useToastStore();

const email = ref<string>("");
const password = ref<string>("");

const emailError = ref<string>("");
const passwordError = ref<string>("");

const validateInput = () => {
  let isValid = true;

  if (!email.value) {
    emailError.value = "Email is required";
    isValid = false;
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      emailError.value = "Please enter a valid email address";
      isValid = false;
    } else {
      emailError.value = "";
    }
  }

  if (!password.value) {
    passwordError.value = "Password is required";
    isValid = false;
  } else {
    passwordError.value = "";
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateInput()) {
    return;
  }

  try {
    await userStore.loginUser(email.value, password.value);

    toastStore.triggerSuccess(`Welcome back, ${email.value}!`);
    await router.push({ name: "home" });
  } catch (error: any) {
    emailError.value = "";
    passwordError.value = "";

    const errorMessage =
      error.message || "Invalid email or password. Please try again.";

    if (errorMessage.includes("Invalid email")) {
      emailError.value = errorMessage;
    } else if (errorMessage.includes("Invalid password")) {
      passwordError.value = errorMessage;
    } else {
      toastStore.triggerError(
        "An unexpected error occurred. Please try again.",
      );
    }
  }
};
</script>

<template>
  <section
    class="3xl:w-1/3 3xl:p-14 mx-auto flex w-full flex-col rounded-2xl bg-white p-8 text-gray-700 shadow-xl md:w-1/2 md:p-10 xl:w-2/5 2xl:w-2/5 2xl:p-12"
  >
    <div class="flex flex-row gap-3 pb-4">
      <div>
        <img src="/favicon.svg" width="50" alt="Logo" />
      </div>
      <h1 class="my-auto text-3xl font-bold">CodeWave</h1>
    </div>
    <div class="pb-8 text-sm font-light">
      Login to your account on CodeWave.
    </div>
    <form @submit.prevent="handleSubmit" class="flex flex-col">
      <div class="pb-2">
        <label for="email" class="mb-2 block text-sm font-medium">Email</label>
        <div class="relative text-gray-400">
          <span class="absolute inset-y-0 left-0 flex items-center p-1 pl-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-mail"
            >
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
          </span>
          <input
            type="email"
            id="email"
            v-model="email"
            @input="emailError = ''"
            class="mb-2 block w-full rounded-lg rounded-l-lg border border-gray-300 bg-gray-50 p-2.5 px-4 py-3 pl-12 text-gray-600 ring ring-transparent focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-400 sm:text-sm"
            placeholder="name@company.com"
            autocomplete="off"
          />
        </div>
        <span class="mt-1 text-sm font-semibold text-red-500" v-if="emailError">
          {{ emailError }}
        </span>
      </div>
      <div class="pb-6">
        <label for="password" class="mb-2 block text-sm font-medium"
          >Password</label
        >
        <div class="relative text-gray-400">
          <span class="absolute inset-y-0 left-0 flex items-center p-1 pl-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-square-asterisk"
            >
              <rect width="18" height="18" x="3" y="3" rx="2"></rect>
              <path d="M12 8v8"></path>
              <path d="m8.5 14 7-4"></path>
              <path d="m8.5 10 7 4"></path>
            </svg>
          </span>
          <input
            type="password"
            v-model="password"
            @input="passwordError = ''"
            id="password"
            placeholder="••••••••••"
            class="mb-2 block w-full rounded-lg rounded-l-lg border border-gray-300 bg-gray-50 p-2.5 px-4 py-3 pl-12 text-gray-600 ring ring-transparent focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-400 sm:text-sm"
            autocomplete="new-password"
          />
        </div>
        <span
          class="mt-1 text-sm font-semibold text-red-500"
          v-if="passwordError"
        >
          {{ passwordError }}
        </span>
      </div>
      <button
        type="submit"
        class="mb-6 w-full rounded-lg bg-amber-600 px-5 py-2.5 text-center text-sm font-medium text-white transition duration-200 hover:bg-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-300"
      >
        Login
      </button>
      <div class="text-sm font-light">
        Don't have an accout yet?
        <router-link
          :to="{ name: 'register' }"
          class="font-medium transition duration-200 hover:underline hover:decoration-amber-600"
          >Sign Up
        </router-link>
      </div>
    </form>
  </section>
</template>
