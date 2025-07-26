<template>
  <div class="w-full">
    <div class="flex gap-x-4">
      <input
        ref="barcodeInput"
        v-model="barcode"
        @keyup.enter="handleScan"
        :disabled="isDisabled"
        type="text"
        class="w-full px-2 py-1 outline-[#DCE3E780] h-14 mt-3 border border-[#DCE3E780] rounded-lg"
        placeholder="Enter barcode number"
      />
      <div
        v-show="!isDisabled"
        class="border border-[#DCE3E780] w-14 h-14 flex justify-center items-center rounded-lg mt-3"
      >
        <img src="/images/barcode.svg" alt="" />
      </div>
      <!-- Trash Icon -->
      <div
        v-show="isDisabled"
        @click="deleteBarcode"
        class="border border-[#DCE3E780] w-14 h-14 flex justify-center items-center rounded-lg mt-3 cursor-pointer"
      >
        <img src="/images/trash.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineProps, defineEmits, watch, nextTick } from "vue";

const props = defineProps<{
  modelValue?: string;
}>();
const isDisabled = ref<boolean>(false);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "scanned", value: string): void;
}>();

const barcode = ref(props.modelValue ?? "");
const barcodeInput = ref<HTMLInputElement | null>(null);

function handleScan() {
  emit("scanned", barcode.value);

  isDisabled.value = true;
  nextTick(() => barcodeInput.value?.focus());
}
function deleteBarcode(): void {
  barcode.value = "";
  isDisabled.value = false;
  emit("update:modelValue", ""); // Ensure v-model sync
  nextTick(() => {
    barcodeInput.value?.focus();
    console.log("Input focused, barcode value:", barcode.value);
  });
}

onMounted(() => {
  barcodeInput.value?.focus();
});

// Sync v-model
watch(
  () => props.modelValue,
  (val) => {
    if (val !== barcode.value) barcode.value = val ?? "";
  }
);
watch(barcode, (val) => {
  emit("update:modelValue", val);
});
</script>
