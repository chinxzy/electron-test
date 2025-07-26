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
        <p class="mb-0 text-textGray text-sm">Home / Customer</p>
      </div>
      <div class="">
        <p></p>
      </div>
      <LoadingComponent v-if="loading" />
      <div v-else class="table w-full mt-9">
        <DataTable
          :value="recordList"
          @row-click="goToSalesDetails"
          class="debt cursor-pointer"
        >
          <Column field="saleNo" header="Sales Number"></Column>
          <Column field="itemCount" header="No. of Items"> </Column>
          <Column field="totalAmountDue" header="Total Amount Due">
            <template #body="data">
              <p class="">
                {{
                  data.data.totalAmountDue
                    ? formatNumber(data.data.totalAmountDue, 2)
                    : "-"
                }}
              </p>
            </template>
          </Column>
          <Column field="outstandingAmount" header="Outstanding Amount">
            <template #body="data">
              <div class="flex gap-x-4 items-center">
                <img src="/images/red-wallet.svg" alt="" />
                <p class="text-error-500">
                  {{
                    data.data.outstandingAmount
                      ? formatNumber(data.data.outstandingAmount, 2)
                      : "-"
                  }}
                </p>
              </div>
            </template>
          </Column>
          <Column field="outstandingDelivery" header="Outstanding Delivery">
            <template #body="data">
              <div class="flex gap-x-4 items-center text-alternateBlack">
                <img
                  src="/images/truck-remove.svg"
                  alt=""
                  v-if="data.data.outstandingDelivery"
                />
                {{ data.data.outstandingDelivery ? "Yes" : "-" }}
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
      <AddCustomer
        :modal2-visible="modalOpen"
        @close-modal2="modalOpen = false"
        @reload="getRecordList"
      />
    </section>
  </MasterLayout>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import MasterLayout from "@/components/layout/MasterLayout.vue";
import { useRoute, useRouter } from "vue-router";
import { formatNumber } from "@/core/helpers/utility";
import AddCustomer from "../Modals/addCustomer.vue";

import { useCustomerStore } from "@/stores/customer";
import type { CustomerDebt } from "@/types/customer";
import SuccessModal from "@/components/ui/modals/successModal.vue";
import LoadingComponent from "@/components/ui/loadingComponent.vue";
const route = useRoute();
const modalOpen = ref<boolean>(false);
const store = useCustomerStore();
const recordList = ref<Array<CustomerDebt>>([]);
const loading = ref<boolean>(false);
const customerKey = String(route.params.id);
const router = useRouter();

async function getRecordList() {
  modalOpen.value = false;
  loading.value = true;
  await store
    .getCustomerDebt(customerKey)
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
.debt {
  .p-datatable-header-cell {
    background-color: #0094a1 !important;
    color: #ffffff !important;
    font-weight: bold;
    font-size: 16px;
    padding: 10px;
  }
}
.p-datatable-tbody > tr > td {
  font-size: 16px;
  font-weight: 400;
  color: #374b58;
}
</style>
