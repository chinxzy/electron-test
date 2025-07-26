<template>
  <div>
    <a-modal
      v-model:open="props.isVisible"
      centered
      :closable="false"
      :footer="null"
      getContainer="#modal-container"
      width="383px"
    >
      <div class="flex justify-center w-auto p-4">
        <div class="text-center">
          <img
            src="../../../assets/icons/red-caution.svg"
            alt=""
            class="mx-auto w-14"
          />
          <p class="text-errorMain font-semibold text-[18px] mt-6 mb-4">
            Error
          </p>
          <p class="text-lessEmphasis mb-6">
            {{ props.message }}
          </p>
          <ButtonComp type="danger" class="w-full h-12" @click="notVisible">
            OK
          </ButtonComp>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useErrorModalStore } from "@/stores/errorStore";
const errorStore = useErrorModalStore();

const notVisible = () => {
  errorStore.hideErrorModal();
};

// const modal2Visible = ref<boolean>(true);
const props = defineProps<{
  message: string;
  isVisible: boolean;
}>();
</script>
