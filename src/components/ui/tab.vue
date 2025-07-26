<template>
  <section :class="containerClass">
    <div
      v-if="tabs"
      class="flex items-center gap-x-4"
      :class="tabsContainerClass"
    >
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        class="cursor-pointer"
        :class="tabClass"
        @click="selectTab(tab.value)"
      >
        <div class="flex justify-center items-center gap-2 px-4">
          <img v-if="tab.icon" :src="getImage(tab)" />
          <p
            :class="[
              {
                'text-primary': selectedTab === tab.value,
                'text-black': selectedTab !== tab.value,
              },
              'text-2xl font-medium',
              tabTextClass,
            ]"
          >
            {{ tab.title }}
          </p>
          <p
            v-if="tab.count != null"
            :class="{
              'text-primary': selectedTab === tab.value,
              'text-black': selectedTab !== tab.value,
            }"
            class="flex items-center justify-center py-2 font-medium text-2xl"
          >
            ({{ tab.count }})
          </p>
        </div>
        <div v-if="selectedTab === tab.value" class="activeTab"></div>
      </div>
    </div>

    <div v-if="tableTitle" class="flex items-center gap-2 p-3">
      <slot name="titleIcon"></slot>
      <h4 class="text-base font-medium text-gray-700">{{ tableTitle }}</h4>

      <div
        v-if="tableCount"
        class="inline-block p-1 px-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-full"
      >
        {{ tableCount }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
// import { PropType } from 'vue';

interface TabItem {
  title: string;
  value: string;
  icon?: string;
  activeIcon?: string;
  count?: number;
}

const props = defineProps<{
  tabs?: TabItem[] | null;
  activeTab?: string;
  tableTitle?: string | null;
  tableCount?: number | null;
  containerClass?: string;
  tabContainerClass?: string;
  tabsContainerClass?: string;
  tabTextClass?: string;
  tabClass?: string;
}>();

const emit = defineEmits<{
  (e: "selectedTab", value: string): void;
}>();

const selectedTab = ref(props.activeTab ?? "");

onMounted(() => {
  if (props.tabs?.length) {
    selectedTab.value = props.tabs[0].value;
  }
});

function selectTab(tabValue: string) {
  selectedTab.value = tabValue;
  emit("selectedTab", tabValue);
}

function getImage(tab: TabItem): string {
  const selectedIcon =
    tab.value === selectedTab.value ? tab.activeIcon : tab.icon;
  return new URL(`../../../assets/svg/${selectedIcon}`, import.meta.url).href;
}
</script>

<style scoped>
.activeTab {
  height: 4px;
  background: #0094a1;
  border-radius: 8px;
}
</style>
