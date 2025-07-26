<template>
  <div>
    <a-modal
      v-model:open="props.isVisible"
      width="25%"
      style="left: 10%"
      :footer="null"
      centered
      :closable="false"
    >
      <div class="flex justify-center w-full p-4">
        <div class="text-center w-full">
          <img
            src="../../../assets/icons/succes.svg"
            alt=""
            class="mx-auto w-[138px]"
          />
          <p class="text-primary font-medium text-[20px] mt-6 mb-4">
            Successful
          </p>
          <p class="text-lessEmphasis mb-6">{{ props.message }}</p>
          <ButtonComp type="primary" class="w-full h-12" @click="closeModal">
            OK
          </ButtonComp>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
const emit = defineEmits(["closeIsVisible"]);
const closeModal = () => {
  emit("closeIsVisible");
};
const props = defineProps<{
  message: string;
  isVisible: boolean;
}>();
</script>
