<template>
  <div id="components-modal-demo-position">
    <a-modal
      v-model:open="successModal"
      title=""
      width="30%"
      style="left: 10%"
      :footer="null"
    >
      <img src="/images/success.svg" alt="" />
      <div>
        <slot></slot>
      </div>

      <div class="w-full">
        <ButtonComp type="primary" class="w-full h-16" @click="proceed">
          Save Changes
        </ButtonComp>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
const emit = defineEmits(["continue"]);
const successModal = ref<boolean>(false);
function proceed() {
  emit("continue");
}
</script>
