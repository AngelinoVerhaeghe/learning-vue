import { watch } from "vue";
import { toast } from "vue-sonner";
import { useToastStore } from "@/stores/ToastStore";

export function useToastHandler() {
  const toastStore = useToastStore();

  watch(
    () => toastStore.toastMessage,
    (message) => {
      if (message && toastStore.toastType) {
        switch (toastStore.toastType) {
          case "success":
            toast.success(message);
            break;
          case "error":
            toast.error(message);
            break;
          case "warning":
            toast.warning(message);
            break;
          case "info":
            toast.info(message);
            break;
        }
        toastStore.resetToast();
      }
    },
    { immediate: true },
  );
}
