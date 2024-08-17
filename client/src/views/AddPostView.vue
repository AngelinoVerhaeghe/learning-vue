<script setup lang="ts" xmlns="http://www.w3.org/1999/html">
import { computed, onMounted, ref } from "vue";
import { usePostStore } from "@/stores/PostStore";
import { useToastStore } from "@/stores/ToastStore";
import { useRouter } from "vue-router";
import { useToastHandler } from "@/composables/useToastHandler";
import { useUserStore } from "@/stores/UserStore";

useToastHandler();

const router = useRouter();
const postStore = usePostStore();
const toastStore = useToastStore();
const userStore = useUserStore();

const titleSlug = computed(() => {
  return title.value.toLowerCase().replace(/ /g, "-");
});

const title = ref<string>("");
const slug = titleSlug;
const description = ref<string>("");
const image = ref<string>("");
const authorId = ref<number | null>(null);
const isPublished = ref<boolean>(false);
const date = ref<Date | null>(null);

const titleError = ref<string>("");
const descriptionError = ref<string>("");
const authorError = ref<string>("");
const dateError = ref<string>("");

const users = ref(userStore.users);
const selectedOption = ref(users.value?.[0] || null); // First user in the list
const isOpen = ref(false); // To open/close dropdown

// Function to toggle dropdown
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// Function to select an option
const selectOption = (option: (typeof users.value)[0]) => {
  selectedOption.value = option;
  authorId.value = option.id; // Set authorId to the selected option
  isOpen.value = false; // Close dropdown after selecting an option
};

// Function to control active state of the option
const isActive = (option: (typeof users.value)[0]) => {
  return selectedOption.value?.id === option.id;
};

const validateInput = () => {
  let isValid = true;

  if (!title.value) {
    titleError.value = "Title is required";
    isValid = false;
  } else {
    titleError.value = "";
  }

  if (!description.value) {
    descriptionError.value = "Description is required";
    isValid = false;
  } else {
    descriptionError.value = "";
  }

  if (authorId.value === null || authorId.value === undefined) {
    authorError.value = "Author is required";
    isValid = false;
  } else {
    authorError.value = "";
  }

  if (!date.value) {
    dateError.value = "Date is required";
    isValid = false;
  } else {
    dateError.value = "";
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateInput()) {
    return;
  }

  try {
    await postStore.createPost(
      title.value,
      slug.value,
      description.value,
      image.value,
      authorId.value ?? 0,
      isPublished.value,
      date.value as Date,
    );

    toastStore.triggerSuccess("Post created successfully!");
    await router.push({ name: "home" });
  } catch (error) {
    console.error(error);
    toastStore.triggerError("There has been a error!");
  }
};

onMounted(async () => {
  await userStore.getUsers();
});
</script>

<template>
  <div class="p-10">
    <div class="rounded-lg bg-gray-800 shadow">
      <div class="p-10 py-10">
        <h1 class="mb-4 text-2xl">Create New Post</h1>
        <form @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 md:grid-cols-6 md:gap-x-6 md:gap-y-8">
            <div class="sm:col-span-3">
              <label
                for="date"
                class="block text-sm font-medium leading-6 text-white"
                >Date</label
              >
              <VueDatePicker
                v-model="date"
                auto-apply
                locale="be-NL"
                placeholder="Select Date"
              />
              <span
                class="mt-1 text-sm font-semibold text-red-500"
                v-if="dateError"
              >
                {{ dateError }}
              </span>
            </div>
            <div class="sm:col-span-3">
              <label
                for="title"
                class="block text-sm font-medium leading-6 text-white"
                >Title</label
              >
              <input
                type="text"
                v-model="title"
                @input="titleError = ''"
                class="block w-full rounded-md border-0 bg-white/5 px-4 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
              />
              <span
                class="mt-1 text-sm font-semibold text-red-500"
                v-if="titleError"
              >
                {{ titleError }}
              </span>
            </div>
            <div class="sm:col-span-3">
              <label
                for="date"
                class="block text-sm font-medium leading-6 text-white"
                >Slug</label
              >
              <input
                type="text"
                v-model="titleSlug"
                class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
              />
            </div>
            <div class="sm:col-span-3">
              <label
                id="listbox-label"
                class="block text-sm font-medium leading-6 text-white"
                >Select Author</label
              >
              <div class="relative mt-2">
                <!-- Button to toggle dropdown -->
                <button
                  type="button"
                  @click="toggleDropdown"
                  class="relative w-full rounded-md border-0 bg-white/5 py-1.5 pl-3 pr-10 text-left text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
                >
                  <span class="block truncate">
                    {{ selectedOption?.userName || "Select Author" }}
                  </span>
                  <span
                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                  >
                    <svg
                      class="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                </button>

                <!-- Dropdown list -->
                <ul
                  v-show="isOpen"
                  class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white/5 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                  tabindex="-1"
                  role="listbox"
                  aria-labelledby="listbox-label"
                >
                  <li
                    v-for="user in userStore.users"
                    :key="user.id"
                    @click="selectOption(user)"
                    class="relative cursor-pointer select-none rounded-md py-2 pl-3 pr-9 text-gray-900 hover:bg-amber-500"
                    :class="{ 'bg-amber-500 text-white': isActive(user) }"
                    role="option"
                  >
                    <span
                      :class="{
                        'font-semibold text-white': isActive(user),
                        'font-normal text-white': !isActive(user),
                      }"
                      class="block truncate"
                    >
                      {{ user.userName }}
                    </span>

                    <!-- Checkmark for selected option -->
                    <span
                      v-if="isActive(user)"
                      class="absolute inset-y-0 right-0 flex items-center pr-4 text-white"
                    >
                      <svg
                        class="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </span>
                  </li>
                </ul>
              </div>
              <span
                class="mt-1 text-sm font-semibold text-red-500"
                v-if="authorError"
              >
                {{ authorError }}
              </span>
            </div>
            <div class="sm:col-span-3">
              <label
                for="description"
                class="block text-sm font-medium leading-6 text-white"
                >Description</label
              >
              <textarea
                v-model="description"
                @input="descriptionError = ''"
                class="block h-32 w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
              ></textarea>
              <p class="mt-3 text-sm leading-6 text-gray-400">
                Write a description.
              </p>
              <span
                class="mt-1 text-sm font-semibold text-red-500"
                v-if="descriptionError"
              >
                {{ descriptionError }}
              </span>
            </div>
            <div class="sm:col-span-3">
              <label
                for="description"
                class="block text-sm font-medium leading-6 text-white"
              >
                Published
              </label>
              <button
                type="button"
                @click="isPublished = !isPublished"
                :class="isPublished ? 'bg-amber-500' : 'bg-white/5'"
                class="relative mt-1 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-offset-2"
                role="switch"
              >
                <span
                  :class="isPublished ? 'translate-x-5' : 'translate-x-0'"
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  aria-hidden="true"
                ></span>
              </button>
            </div>
          </div>
          <div class="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              @click="() => $router.push('/')"
              class="text-sm font-semibold leading-6 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dp__theme_light {
  --dp-background-color: rgba(255, 255, 255, 0.05);
  --dp-text-color: #ffffff;
  --dp-hover-color: #f3f3f3;
  --dp-hover-text-color: #212121;
  --dp-hover-icon-color: #959595;
  --dp-primary-color: rgb(99, 10, 241);
  --dp-primary-disabled-color: #6bacea;
  --dp-primary-text-color: #ffffff;
  --dp-secondary-color: #c0c4cc;
  --dp-border-color: rgb(255, 255, 255, 0.1);
  --dp-menu-border-color: #ddd;
  --dp-border-color-hover: #aaaeb7;
  --dp-border-color-focus: #aaaeb7;
  --dp-disabled-color: #f6f6f6;
  --dp-scroll-bar-background: #f3f3f3;
  --dp-scroll-bar-color: #959595;
  --dp-success-color: #76d275;
  --dp-success-color-disabled: #a3d9b1;
  --dp-icon-color: #ffffff;
  --dp-danger-color: #ff6f60;
  --dp-marker-color: #ff6f60;
  --dp-tooltip-color: #fafafa;
  --dp-disabled-color-text: #ffffff;
  --dp-highlight-color: rgb(25 118 210 / 10%);
  --dp-range-between-dates-background-color: var(--dp-hover-color, #f3f3f3);
  --dp-range-between-dates-text-color: var(--dp-hover-text-color, #212121);
  --dp-range-between-border-color: var(--dp-hover-color, #f3f3f3);
}

.dp__main {
  /*General*/
  --dp-font-family: -apple-system, blinkmacsystemfont, "Segoe UI", roboto,
    oxygen, ubuntu, cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  --dp-border-radius: 0.375rem; /*Configurable border-radius*/
  --dp-cell-border-radius: 0.375rem; /*Specific border radius for the calendar cell*/
  --dp-common-transition: all 0.1s ease-in; /*Generic transition applied on buttons and calendar cells*/

  /*Sizing*/
  --dp-button-height: 35px; /*Size for buttons in overlays*/
  --dp-month-year-row-height: 35px; /*Height of the month-year select row*/
  --dp-month-year-row-button-size: 35px; /*Specific height for the next/previous buttons*/
  --dp-button-icon-height: 20px; /*Icon sizing in buttons*/
  --dp-cell-size: 35px; /*Width and height of calendar cell*/
  --dp-cell-padding: 5px; /*Padding in the cell*/
  --dp-common-padding: 10px; /*Common padding used*/
  --dp-input-icon-padding: 35px; /*Padding on the left side of the input if icon is present*/
  --dp-input-padding: 6px 30px 6px 12px; /*Padding in the input*/
  --dp-menu-min-width: 260px; /*Adjust the min width of the menu*/
  --dp-action-buttons-padding: 2px 5px; /*Adjust padding for the action buttons in action row*/
  --dp-row-margin: 5px 0; /*Adjust the spacing between rows in the calendar*/
  --dp-calendar-header-cell-padding: 0.5rem; /*Adjust padding in calendar header cells*/
  --dp-two-calendars-spacing: 10px; /*Space between multiple calendars*/
  --dp-overlay-col-padding: 3px; /*Padding in the overlay column*/
  --dp-time-inc-dec-button-size: 32px; /*Sizing for arrow buttons in the time picker*/
  --dp-menu-padding: 6px 8px; /*Menu padding*/

  /*Font sizes*/
  --dp-font-size: 1rem; /*Default font-size*/
  --dp-preview-font-size: 0.8rem; /*Font size of the date preview in the action row*/
  --dp-time-font-size: 0.8rem; /*Font size in the time picker*/

  /*Transitions*/
  --dp-animation-duration: 0.1s; /*Transition duration*/
  --dp-menu-appear-transition-timing: cubic-bezier(
    0.4,
    0,
    1,
    1
  ); /*Timing on menu appear animation*/
  --dp-transition-timing: ease-out; /*Timing on slide animations*/
}
</style>
