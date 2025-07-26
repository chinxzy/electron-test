<template>
  <div class="flex items-center">
    <label class="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        class="sr-only peer"
        :checked="modelValue"
        @change="toggleSwitch"
      />
      <div
        class="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary transition-colors"
      ></div>
      <div
        class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform transform peer-checked:translate-x-5"
      ></div>
    </label>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";

// Props
const props = defineProps<{
  modelValue: boolean;
}>();

// Emits
const emit = defineEmits(["update:modelValue"]);

// Toggle function
const toggleSwitch = () => {
  emit("update:modelValue", !props.modelValue);
};
</script>
