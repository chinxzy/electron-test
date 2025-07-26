<template>
  <input
    v-model="formattedValue"
    ref="inputRef"
    type="text"
    class="w-full px-2 py-1 outline-[#DCE3E780] h-[52px] mt-3 border border-[#DCE3E780] rounded-lg"
  />
</template>

<script lang="ts" setup>
import { useCurrencyInput } from "vue-currency-input";
import { watch } from "vue";
import type { CurrencyInputOptions } from "vue-currency-input";

const props = defineProps<{
  modelValue: number;
  options?: CurrencyInputOptions;
  maxNumber?: number;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const { inputRef, formattedValue, numberValue, setValue } = useCurrencyInput({
  currency: "NGN",
  locale: "en-NG",
  precision: 2,
  autoDecimalDigits: true,
  hideCurrencySymbolOnFocus: false,
  hideGroupingSeparatorOnFocus: false,
  valueRange: { min: 0, max: props.maxNumber },
  ...props.options,
});

// Update internal value if `modelValue` changes from outside (e.g., watcher)
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== numberValue.value) {
      setValue(newVal);
    }
  }
);

// Emit when input changes
watch(numberValue, (newVal) => {
  emit("update:modelValue", newVal ?? 0);
});
</script>
