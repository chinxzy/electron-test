<template>
  <DataTable :value="products" tableStyle="min-width: 50rem" class="rowww">
    <Column field="" header="">
      <template #body="data">
        <router-link
          :to="{
            path: `/product/${data.data.productKey}`,
            query: {
              productName: data.data.name,
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
                <p>
                  Quantity Remaining: {{ data.data.quantity }}
                  {{ data.data.measurementUnitName }}
                </p>
                <p>|</p>

                <p>Unit Price: {{ formatNumber(data.data.unitPrice, 0) }}</p>
                <p>
                  <Status :text="data.data.attentionNote" />
                </p>
                <!-- <p v-if="data.data.productType == 'Service'">|</p>
                <p v-if="data.data.productType == 'Service'">
                  Measurement Unit: {{ data.data.measurementUnitName }}
                </p> -->
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
  //   productGroups: {
  //     type: Array,
  //     required: true,
  //   },
});
</script>
<style lang="scss">
/* GLOBAL: If not using scoped styles */
.row {
  .p-datatable-header-cell {
    display: none !important;
  }
}
</style>
