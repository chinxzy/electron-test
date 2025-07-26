<template>
  <MasterLayout>
    <template #breadcrumb>
      <Breadcrumb :breadcrumbs="[{ label: 'Sales', path: '/todays-sales' }]" />
    </template>
    <section class="">
      <div
        class="flex items-center gap-x-2 mb-3 cursor-pointer w-fit"
        @click="$router.back()"
      >
        <img src="/images/chevron-left.svg" alt="" />
        <p class="mb-0 text-textGray text-sm">Home</p>
      </div>
      <div class="">
        <p></p>
      </div>
      <LoadingComponent v-if="loading" />
      <div v-else class="table w-full mt-9">
        <DataTable
          :value="recordList"
          class="current cursor-pointer"
          @row-click="goToSalesDetails"
        >
          <Column field="saleNo" header="Sales Number">
            <template #body="data">
              <p class="">#{{ data.data.saleNo }}</p>
            </template>
          </Column>
          <Column field="itemCount" header="No. of Items">
            <template #body="data">
              <p class="">{{ data.data.itemCount }} items</p>
            </template>
          </Column>
          <Column field="amountDue" header="Total Amount Due">
            <template #body="data">
              <p class="">
                {{
                  data.data.amountDue
                    ? formatNumber(data.data.amountDue, 2)
                    : "-"
                }}
              </p>
            </template>
          </Column>
          <Column field="customerName" header="Customer Name"> </Column>
          <Column
            field="outstandingDelivery"
            header="Outstanding Amount/Delivery"
          >
            <template #body="data">
              <div class="flex flex-col gap-y-3">
                <div
                  v-if="!data.data.isPaymentComplete"
                  class="flex gap-x-4 items-center text-error-500"
                >
                  <img src="/images/wallet-3.svg" alt="" />
                  <p>{{ formatNumber(data.data.outstandingAmount, 2) }}</p>
                </div>
                <div
                  v-if="!data.data.isDeliveryComplete"
                  class="flex gap-x-4 items-center"
                >
                  <img src="/images/truck-remove.svg" alt="" />
                  <p>Outstanding Delivery</p>
                </div>
                <p
                  v-if="
                    data.data.isPaymentComplete && data.data.isDeliveryComplete
                  "
                >
                  -
                </p>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </section>
  </MasterLayout>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import MasterLayout from "@/components/layout/MasterLayout.vue";
import { useRoute, useRouter } from "vue-router";
import { formatNumber } from "@/core/helpers/utility";

import { useSalesStore } from "@/stores/sales";
import type { SalesList } from "@/types/sales";

import LoadingComponent from "@/components/ui/loadingComponent.vue";
const route = useRoute();
const router = useRouter();
const store = useSalesStore();
const recordList = ref<Array<SalesList>>([]);
const loading = ref<boolean>(false);
// const customerKey = String(route.params.id);

async function getRecordList() {
  loading.value = true;
  await store
    .getTodaysSalesRecord()
    .then((response: any) => {
      recordList.value = response;
    })
    .finally(() => {
      loading.value = false;
    });
}
function goToSalesDetails(event: any) {
  const salesId = event.data.saleKey;
  router.push(`/sales-record-detail/${salesId}`);
}
getRecordList();
</script>

<style lang="scss">
.current {
  .p-datatable-header-cell {
    background-color: #0094a1 !important;
    color: #ffffff !important;
    font-weight: bold;
    font-size: 16px;
    padding: 10px;
  }
  .p-datatable-tbody > tr > td {
    font-size: 16px;
    font-weight: 400;
    color: #374b58;
  }
}
</style>
