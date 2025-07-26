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
        <p class="mb-0 text-textGray text-sm">Home / Customers</p>
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
              <span class="text-sm font-semibold">Add Customer</span>
            </div>
          </ButtonComp>
        </div>
      </div>
      <LoadingComponent v-if="loading" />
      <div v-else class="table w-full mt-9">
        <DataTable
          :value="recordList"
          @row-click="goToUserDetails"
          class="cursor-pointer customer"
        >
          <Column field="customerName" header="Full Name"></Column>
          <Column field="phoneNumber" header="Phone Number">
            <template #body="data">
              <p>
                {{ data.data.phoneNumber ?? "-" }}
              </p>
            </template>
          </Column>
          <Column field="totalDebt" header="Amount Owed">
            <template #body="data">
              <p class="text-error-500">
                {{
                  data.data.totalDebt
                    ? formatNumber(data.data.totalDebt, 2)
                    : "-"
                }}
              </p>
            </template>
          </Column>
          <Column field="note" header="Note">
            <template #body="data">
              {{ data.data.note ? data.data.note : "..." }}
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
import { useRouter } from "vue-router";
import MasterLayout from "@/components/layout/MasterLayout.vue";
import { formatNumber } from "@/core/helpers/utility";
import AddCustomer from "../Modals/addCustomer.vue";
import { useCustomerStore } from "@/stores/customer";
import type { CustomerList } from "@/types/customer";
import SuccessModal from "@/components/ui/modals/successModal.vue";
import LoadingComponent from "@/components/ui/loadingComponent.vue";
const modalOpen = ref<boolean>(false);
const store = useCustomerStore();
const recordList = ref<Array<CustomerList>>([]);
const loading = ref<boolean>(false);
const router = useRouter();
async function getRecordList() {
  modalOpen.value = false;
  loading.value = true;
  await store
    .getCustomerList()
    .then((response: any) => {
      recordList.value = response;
    })
    .finally(() => {
      loading.value = false;
    });
}

function goToUserDetails(event: any) {
  const userId = event.data.customerKey;
  router.push(`/customer-debt/${userId}`);
}
getRecordList();
</script>

<style lang="scss">
.customer {
  .p-datatable-header-cell {
    background-color: #0094a1 !important;
    color: #ffffff !important;
    font-weight: bold;
    font-size: 14px;
    padding: 10px;
  }
  .p-datatable-tbody > tr > td {
    font-size: 14px;
    font-weight: 600;
    color: #000000;
  }
}
</style>
