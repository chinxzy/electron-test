<template>
  <div
    class="error flex items-center mt-3 bg-nuseryRed p-2 rounded-lg justify-between"
  >
    <div class="flex">
      <img
        src="../../assets/icons/red-caution.svg
            "
        alt=""
        class="mr-2"
      />
      <div class="text-danger"><slot></slot></div>
    </div>
    <img
      src="../../assets/icons/close-circle.svg
            "
      alt=""
      class="cursor-pointer"
      @click="closeToast"
    />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["closeToast"]);
const closeToast = () => {
  emit("closeToast");
};
</script>
