<template>
  <MasterLayout>
    <template #breadcrumb>
      <Breadcrumb :breadcrumbs="[{ label: 'Product', path: '/product' }]" />
    </template>
    <section class="">
      <div
        class="flex items-center gap-x-2 mb-3 cursor-pointer"
        @click="$router.back()"
      >
        <img src="/images/chevron-left.svg" alt="" />
        <p class="mb-0 text-textGray text-sm">Home / Products</p>
      </div>
      <div class="flex justify-between">
        <div class="relative w-full max-w-md">
          <span
            class="absolute inset-y-0 left-3 flex items-center text-gray-400"
          >
            <img src="/images/search.svg" alt="" class="mr-2" />
          </span>
          <input
            type="text"
            placeholder="Search"
            class="w-full pl-10 pr-4 py-2 border border-[#D7D7D7] rounded-lg text-gray-700 focus:outline-none"
          />
        </div>
        <div>
          <ButtonComp type="primary" class="w-full" @click="modalOpen = true">
            <div class="flex items-center gap-x-2">
              <img src="/images/add-circle.svg" alt="" />
              <span class="text-sm font-semibold">Create Products</span>
              <img src="/images/arrow-down.svg" alt="" />
            </div>
          </ButtonComp>
        </div>
      </div>

      <div>
        <DataTable :value="recordList" tableStyle="min-width: 50rem">
          <div class="flex gap-x-3 py-4 mb-10 mt-9 px-4">
            <div class="border border-gray-200 h-10 w-10 p-2 rounded-lg">
              <img src="/images/folder-open.svg" alt="" />
            </div>
            <div class="space-y-4">
              <p class="text-2xl font-medium text-primary">
                {{ route.query.productName }}
              </p>
            </div>
          </div>
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

                      <p>
                        Unit Price: {{ formatNumber(data.data.unitPrice, 0) }}
                      </p>
                      <p v-if="data.data.productType == 'Goods'">
                        <Status :text="data.data.attentionNote" />
                      </p>
                      <p
                        v-if="
                          data.data.productType == 'Service' ||
                          data.data.productType == 'GoodsWithoutInventory'
                        "
                      >
                        |
                      </p>
                      <p
                        v-if="
                          data.data.productType == 'Service' ||
                          data.data.productType == 'GoodsWithoutInventory'
                        "
                      >
                        Measurement Unit: {{ data.data.measurementUnitName }}
                      </p>
                      <p
                        v-if="data.data.productType == 'GoodsWithoutInventory'"
                      >
                        <Status :text="data.data.attentionNote" />
                      </p>
                    </div>
                  </div>
                </div>
              </router-link>
            </template>
          </Column>
        </DataTable>
      </div>
      <div>
        <CreateProducts
          :modal2-visible="modalOpen"
          :product-groups="recordGroupList"
          @close-modal2="modalOpen = false"
          @reload="getRecordList, (modalOpen = false)"
        />
      </div>
    </section>
  </MasterLayout>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import MasterLayout from "@/components/layout/MasterLayout.vue";
import Breadcrumb from "@/components/layout/Breadcrumb.vue";
import ButtonComp from "@/components/ui/button.vue";
import CreateProducts from "./Modals/createProducts.vue";
import { usePoductStore } from "@/stores/product";
import type { ProductList, ProductGroupList } from "@/types/product";
import { formatNumber } from "@/core/helpers/utility";
import { useRoute } from "vue-router";

const store = usePoductStore();
const recordList = ref<Array<ProductList>>([]);
const recordGroupList = ref<Array<ProductGroupList>>([]);
const loading = ref<boolean>(false);
const modalOpen = ref<boolean>(false);

const route = useRoute();

async function getRecordList() {
  const key = String(route.params.id);
  loading.value = true;
  await store
    .getProductListByGroup(key)
    .then((response: any) => {
      recordList.value = response.productItems;
    })
    .finally(() => {
      loading.value = false;
    });
}

getRecordList();
</script>
<style lang="scss">
/* GLOBAL: If not using scoped styles */

.p-datatable-header-cell {
  display: none !important;
}
</style>
