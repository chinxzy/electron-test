// stores/errorModal.ts
import { defineStore } from "pinia";
import { ref } from "vue";

export const useErrorModalStore = defineStore("errorModal", () => {
  const isVisible = ref(false);
  const message = ref("");

  function showErrorModal(errorMessage: string) {
    message.value = errorMessage;
    isVisible.value = true;
  }

  function hideErrorModal() {
    isVisible.value = false;
    message.value = "";
  }

  return { isVisible, message, showErrorModal, hideErrorModal };
});
