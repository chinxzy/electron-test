<template>
  <div>
    <img src="/images/appLogo.svg" alt="" class="mb-16" />
    <div v-for="route in routes.routes" :key="route.route" class="">
      <!-- <section> -->

      <div>
        <div
          class="flex items-center px-6 py-2.5 text-sm font-medium rounded cursor-pointer"
          :class="{
            'bg-[#0094A166] border border-[#E6E6E633] rounded-lg':
              route.name.includes(routeName),
            'text-gray-600': !route.name.includes(routeName),
          }"
        >
          <img
            :src="getIconPath(route.routeIcon)"
            alt=""
            class="w-5 h-5 mr-3"
          />
          <div
            class="flex justify-between w-full text-lg font-semibold text-white"
          >
            {{ route.route }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

import routes from "@/core/helpers/routes";
const route = useRoute();
const routeName = computed(() => String(route.name));
function getIconPath(iconName: any) {
  return new URL(`../../../public/images/${iconName}`, import.meta.url).href;
}
</script>
