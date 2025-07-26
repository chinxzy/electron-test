<template>
  <DataTable :value="productGroups" tableStyle="min-width: 50rem" class="test">
    <Column field="" class="rowww">
      <template #body="data">
        <router-link
          :to="{
            path: `/product-group/${data.data.productGroupKey}`,
            query: {
              productName: data.data.productGroupName,
            },
          }"
        >
          <div class="flex gap-x-3 py-4">
            <div class="border border-gray-200 h-10 w-10 p-2 rounded-lg">
              <img src="/images/folder-open.svg" alt="" />
            </div>
            <div class="space-y-4">
              <p class="text-2xl font-medium text-black">
                {{ data.data.productGroupName }}
              </p>
            </div>
          </div></router-link
        >
      </template>
    </Column>
  </DataTable>
  <DataTable :value="products" tableStyle="min-width: 50rem">
    <Column field="" header="">
      <template #body="data">
        <router-link
          :to="{
            path: `/product/${data.data.productKey}`,
            query: {
              productName: data.data.name,
              type: data.data.productType,
              incoming: data.data.hasIncomingStock,
            },
          }"
        >
          <div class="flex gap-x-3 py-4">
            <div class="border border-gray-200 h-10 w-10 p-2 rounded-lg">
              <img src="/images/ion_cart.svg" alt="" />
            </div>
            <div class="space-y-4">
              <p class="text-2xl font-medium text-black">
                {{ data.data.name }}
              </p>
              <div class="flex text-lessEmphasis items-center gap-x-4">
                <p v-if="data.data.productType == 'Goods'">
                  Quantity Remaining: {{ data.data.quantity }}
                  {{ data.data.measurementUnitName }}
                </p>
                <p v-if="data.data.productType == 'Goods'">|</p>

                <p>Unit Price: {{ formatNumber(data.data.unitPrice, 0) }}</p>
                <p v-if="data.data.productType == 'Goods'">
                  <Status :text="data.data.attentionNote" />
                </p>
                <p v-if="data.data.productType != 'Goods'">|</p>
                <p v-if="data.data.productType != 'Goods'">
                  Measurement Unit: {{ data.data.measurementUnitName }}
                </p>
              </div>
            </div>
          </div>
        </router-link>
      </template>
    </Column>
  </DataTable>
</template>
<script setup lang="ts">
import { formatNumber } from "@/core/helpers/utility";
import Status from "@/components/ui/status.vue";
const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
  productGroups: {
    type: Array,
    required: true,
  },
});
</script>
<style lang="scss">
/* GLOBAL: If not using scoped styles */

.rowww {
  display: none !important;
}
</style>
