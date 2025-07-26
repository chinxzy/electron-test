<template>
  <div :class="bgColor" class="flex items-center gap-2 px-2 py-1 rounded-xl">
    <p :class="textColor" class="font-medium">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";

import { lowerCase } from "@/core/helpers/utility";

// Props
const props = defineProps<{
  text?: string;
  hasIcon?: boolean;
}>();

// Default prop values
const hasIcon = computed(() => props.hasIcon ?? true);

// Reactive state
const textColor = ref("text-gray-600");
const bgColor = ref("bg-gray-200");
const currentIcon = ref("");

// Status logic
function checkStatus() {
  const rawText = props.text ?? "";
  const text = rawText.trim().toLowerCase();

  if (["in stock"].includes(text)) {
    textColor.value = "text-[#72BF45]";
    bgColor.value = "bg-[#DFF1D5]";
  } else if (["out of stock"].includes(text)) {
    textColor.value = "text-error-500";
    bgColor.value = "bg-nuseryRed";
  } else if (["incoming stock"].includes(text)) {
    textColor.value = "text-[#0077FF]";
    bgColor.value = "bg-[#C7E1FF]";
  } else if (text === "low stock") {
    textColor.value = "text-[#FF9811]";
    bgColor.value = "bg-[#FFF2E0]";
  } else {
    // Fallback
    textColor.value = "text-gray-600";
  }
}

// Lifecycle
onMounted(() => {
  checkStatus();
});

// Watcher
watch(
  () => props.text,
  () => {
    checkStatus();
  }
);
</script>

<style scoped>
.positive {
  font-weight: 500;
  font-size: 14px;
  color: #155c22;
}

.negative {
  font-weight: 500;
  font-size: 14px;
  color: #e11900;
}
</style>
