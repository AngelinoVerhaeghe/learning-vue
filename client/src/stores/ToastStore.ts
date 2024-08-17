import { defineStore } from "pinia";
import { ref } from "vue";

export const useToastStore = defineStore("toast", () => {
  const toastMessage = ref<string | null>(null);
  const toastType = ref<"success" | "error" | "warning" | "info" | null>(null);

  function triggerSuccess(message: string) {
    toastMessage.value = message;
    toastType.value = "success";
  }

  function triggerError(message: string) {
    toastMessage.value = message;
    toastType.value = "error";
  }

  function triggerWarning(message: string) {
    toastMessage.value = message;
    toastType.value = "warning";
  }

  function triggerInfo(message: string) {
    toastMessage.value = message;
    toastType.value = "info";
  }

  function resetToast() {
    toastMessage.value = null;
  }

  return {
    toastMessage,
    toastType,
    triggerSuccess,
    triggerError,
    triggerWarning,
    triggerInfo,
    resetToast,
  };
});
