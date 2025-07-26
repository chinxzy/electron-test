<template>
  <button
    :disabled="props.type === 'primary-disabled'"
    :class="[
      'py-2 px-4 rounded-md focus:outline-none',
      {
        'bg-primary-500 text-white': props.type === 'primary',
        'bg-primary text-white': props.type === 'lightPrimary',
        'bg-primary-100 text-white': props.type === 'primary-disabled',
        'bg-secondary text-gray-700 ': props.type === 'secondary',
        'bg-errorMain text-white hover:bg-red-600': props.type === 'danger',
        'bg-green-500 text-white hover:bg-green-600': props.type === 'success',
        'bg-error-500 text-white hover:bg-error-500': props.type === 'error',
        'bg-white text-primary border border-primary hover:bg-white':
          props.type === 'primary-outline',
      },
    ]"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
// import { defineEmits } from 'vue';

const props = defineProps<{
  type:
    | "primary"
    | "none"
    | "secondary"
    | "danger"
    | "success"
    | "primary-disabled"
    | "error"
    | "lightPrimary"
    | "primary-outline";
}>();

const emits = defineEmits(["click"]);

const handleClick = () => {
  emits("click");
};
</script>
