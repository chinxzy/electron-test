<template>
  <div class="relative w-full" ref="dropdownRef">
    <div class="mb-3" v-if="label.trim() !== ''">
      <label class="text-base leading-5">
        {{ label }}
        <span v-if="required" class="text-error-500">*</span>
      </label>
    </div>

    <button
      type="button"
      @click="toggleDropdown"
      class="flex justify-between w-full text-sm font-normal rounded-lg focus:outline-none border border-[#DCE3E780] items-center"
      :class="{
        'bg-inputGrey-500 text-inputGrey-600': disabled,
        ' bg-inputGrey-500': !disabled,
        'p-2 border border-gray-300 text-gray-700': tableFilter,
        'px-3.5 h-14  text-inputGrey-900': !tableFilter,
      }"
      :disabled="disabled"
    >
      <span> <slot name="icon"></slot> </span>
      <span
        class="flex-1 text-left text-gray-400"
        :class="{
          'text-[#000]': selectedLabel,
        }"
      >
        {{ selectedLabel || buttonText }}
      </span>

      <section>
        <div v-if="!loading">
          <span
            :class="{
              'rotate-180 ease-in-out duration-700': isOpen,
              'rotate-0 ease-in-out duration-700': !isOpen,
            }"
          >
            <img v-if="!disabled" src="/images/angle-down.svg" alt="" />
            <img v-else src="/images/angle-down.svg" alt="" />
          </span>
        </div>
      </section>
    </button>

    <transition
      @before-enter="beforeEnter"
      @enter="enter"
      @before-leave="beforeLeave"
      @leave="leave"
    >
      <div
        v-if="isOpen"
        class="mt-2 bg-white border border-gray-300 rounded-lg px-3 py-4 max-h-[266px] overflow-y-scroll main w-full"
        :class="{ 'absolute z-[300]': isOverlay }"
      >
        <ul class="h-full max-h-[266px]">
          <li v-if="hasSearch" class="absolute w-[95%]">
            <div class="relative w-full max-w-md">
              <span
                class="absolute inset-y-0 left-3 flex items-center text-gray-400"
              >
                <img src="/images/search.svg" alt="" class="mr-2" />
              </span>
              <input
                type="text"
                placeholder="Search"
                v-model="searchQuery"
                class="w-full pl-10 pr-4 py-2 border border-[#D7D7D7] rounded-lg text-gray-700 focus:outline-none"
              />
            </div>
          </li>
          <div :class="`${hasSearch && 'py-14'}`">
            <div v-if="filteredItems.length > 0">
              <li
                v-for="(option, index) in filteredItems"
                :key="index"
                @click="selectOption(option)"
                class="px-4 py-3 mb-2 text-sm font-normal border-gray-200 rounded-lg cursor-pointer text-inputGrey-900 bg-[#DCE3E780] focus:outline-none"
              >
                <p>{{ option.label }}</p>
                <div
                  v-if="isSalesRecord"
                  class="flex gap-x-3 mt-3 text-lessEmphasis text-xs"
                >
                  <span>
                    Unit Price: {{ formatNumber(Number(option.subLabel1), 2) }}
                  </span>
                  <span v-if="option.subLabel2">|</span>
                  <span v-if="option.subLabel2">
                    Qty: {{ option.subLabel2 }}
                  </span>
                </div>
              </li>
            </div>
            <div v-else>
              <p class="text-center text-black text-sm">No data available</p>
            </div>
          </div>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { formatNumber } from "@/core/helpers/utility";
import {
  ref,
  computed,
  defineProps,
  defineEmits,
  onMounted,
  onUnmounted,
} from "vue";

interface Option {
  label: string;
  value: string | number;
  subLabel1: string | number;
  subLabel2: string | number;
}

// Props
const props = defineProps<{
  loading?: boolean;
  options: Option[];
  buttonText?: string;
  isOverlay?: boolean;
  disabled?: boolean;
  hasSearch?: boolean;
  tableFilter?: boolean;
  label: string;
  modelValue: string | number | null;
  required?: boolean;
  isSalesRecord?: boolean;
}>();

// Emits
const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const selectedLabel = ref<string | null>(null);
const salesRecordSub1 = ref<string | number | null>(null);
const salesRecordSub2 = ref<string | number | null>(null);
const searchQuery = ref("");
const dropdownRef = ref<HTMLElement | null>(null);

// Computed: Filtered list based on search
const filteredItems = computed(() => {
  return props.options.filter((item) => {
    return item.label.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

// Methods
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  searchQuery.value = "";
};

const selectOption = (option: Option) => {
  selectedLabel.value = option.label;
  salesRecordSub1.value = option.subLabel1;
  salesRecordSub2.value = option.subLabel2;
  isOpen.value = false;
  emit("update:modelValue", option.value);
};

const searchItems = (event: Event) => {
  searchQuery.value = (event.target as HTMLInputElement).value;
};

const clearInput = () => {
  searchQuery.value = "";
};

const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

// Transitions
const beforeEnter = (el: any) => {
  el.style.opacity = "0";
};
const enter = (el: any, done: () => void) => {
  el.style.transition = "opacity 0.7s ease-in-out";
  el.style.opacity = "1";
  done();
};
const beforeLeave = (el: any) => {
  el.style.opacity = "1";
};
const leave = (el: any, done: () => void) => {
  el.style.transition = "opacity 0.3s ease-in-out";
  el.style.opacity = "0";
  setTimeout(done, 300);
};

// Lifecycle Hooks
onMounted(() => {
  if (props.modelValue) {
    const selectedOption = props.options.find(
      (option) => option.value === props.modelValue
    );
    selectedLabel.value = selectedOption?.label || null;
  }
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
/* Hide scrollbar */
.main::-webkit-scrollbar {
  display: none;
}
.main {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
