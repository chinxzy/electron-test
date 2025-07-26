<template>
  <nav aria-label="breadcrumb">
    <ol class="flex">
      <li
        v-for="(crumb, index) in breadcrumbs"
        :key="index"
        class="flex items-center"
      >
        <router-link
          :to="{
            path: crumb.path?.includes('/') ? crumb.path : undefined,
            name: !crumb.path?.includes('/') ? crumb.path : undefined,
          }"
          :class="getCrumbClass(crumb.path, index)"
        >
          {{ crumb.label }}
        </router-link>
        <span v-if="index < breadcrumbs.length - 1" class="mx-2 text-gray-400">
          <!-- <img src="@/assets/svg/chevron-right.svg" alt="" /> -->
        </span>
      </li>
    </ol>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface Breadcrumb {
  label: string;
  path: string;
}

export default defineComponent({
  props: {
    breadcrumbs: {
      type: Array as () => Breadcrumb[],
      required: true,
    },
  },
  methods: {
    isCurrentRoute(path: string): boolean {
      return this.$route.path === path || this.$route.name === path;
    },
    goBack(): void {
      this.$router.back();
    },
    getCrumbClass(path: string, index: number): string {
      console.log("Current route:", path);
      return this.isCurrentRoute(path)
        ? "text-[#121212] text-2xl font-millik font-bold"
        : "text-base font-medium text-gray-700 font-sf-pro";
    },
  },
});
</script>

<style scoped>
/* Add any additional styling here if needed */
</style>
