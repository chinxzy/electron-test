<template>
  <MasterLayout>
    <template #breadcrumb>
      <Breadcrumb :breadcrumbs="[{ label: 'POS', path: '/pos' }]" />
    </template>
    <section>
      <div class="grid grid-cols-3 gap-x-8 py-10">
        <div class="flex flex-col gap-y-12">
          <router-link to="/record-sales">
            <button
              class="bg-primary text-white rounded-md focus:outline-none px-12 py-5 w-full"
            >
              <div class="flex items-center gap-x-6">
                <img src="/images/book.svg" alt="" /><span
                  class="text-3xl font-medium"
                >
                  Record Sale
                </span>
              </div>
            </button>
          </router-link>
          <router-link to="/product"
            ><button
              class="bg-[#72BF45] text-white rounded-md focus:outline-none px-12 py-5 w-full"
            >
              <div class="flex items-center gap-x-6">
                <img src="/images/cart.svg" alt="" /><span
                  class="text-3xl font-medium"
                >
                  Product
                </span>
              </div>
            </button></router-link
          >
          <router-link to="/customers"
            ><button
              class="bg-[#0077FF] text-white rounded-md focus:outline-none px-12 py-5 w-full"
            >
              <div class="flex items-center gap-x-6">
                <img src="/images/people.svg" alt="" /><span
                  class="text-3xl font-medium"
                >
                  Customer
                </span>
              </div>
            </button></router-link
          >
        </div>
        <div
          class="col-span-2 border border-[#DCE3E7] rounded-xl p-6 flex flex-col h-full"
        >
          <div class="grid grid-cols-3 gap-x-4 w-full mb-5">
            <div class="col-span-2">
              <div class="relative w-full">
                <span
                  class="absolute inset-y-0 left-3 flex items-center text-gray-400"
                >
                  <img src="/images/search.svg" alt="" class="mr-2" />
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  class="w-full pl-10 pr-4 py-2 border border-[#D7D7D7] rounded-lg text-gray-700 focus:outline-none h-14"
                  v-model="query"
                />
              </div>
            </div>
            <div class="w-20%">
              <ButtonComp
                type="primary"
                class="w-full h-14 px-6"
                @click="getSearchedRecordList"
              >
                <p>Search</p>
              </ButtonComp>
            </div>
          </div>
          <div class="flex justify-between text-2xl" v-if="!isQueried">
            <p class="mb-0">Sales Recorded Today</p>
            <p class="text-lessEmphasis">
              {{ formatDate(new Date(), "MMMM D, YYYY") }}
            </p>
          </div>
          <div v-else class="font-semibold flex justify-between items-center">
            <p>Showing results for: {{ searchedQuery }}</p>
            <img @click="getRecordList" src="/images/close.svg" alt="" />
          </div>

          <LoadingComponent v-if="loading" />
          <div
            class="flex flex-col items-center justify-center my-[100px]"
            v-if="!loading && !recordList?.length"
          >
            <img src="/images/data-phishing.svg" alt="" />
            <p>No Sale Has Been Recorded Today</p>
          </div>
          <div class="w-full" v-if="!loading && recordList?.length">
            <DataTable
              :value="recordList"
              scrollable
              @row-click="goToSalesDetails"
              scrollHeight="900px"
              class="overflow-hidden hide-scrollbar cursor-pointer"
            >
              <Column field="" header="">
                <template #body="data">
                  <section class="flex justify-between w-full">
                    <div>
                      <p class="text-2xl text-alternateBlack">
                        {{ data.data.saleNo }}
                      </p>
                      <div
                        class="bg-nurseryBlue-10 text-primary text-center px-4 py-2 mt-4 rounded-full text-[18px]"
                      >
                        {{ data.data.itemCount }} items
                      </div>
                    </div>
                    <div>
                      <p class="text-[32px] text-gray">
                        {{ formatNumber(data.data.amountPaid, 2) }}
                      </p>
                    </div>
                  </section>
                </template>
              </Column>
            </DataTable>
          </div>
          <div
            class="text-center w-full mt-auto text-2xl text-primary"
            v-if="recordList?.length && !isQueried"
          >
            <router-link to="/todays-sales"
              ><p class="cursor-pointer">View All</p></router-link
            >
          </div>
        </div>
      </div>
    </section>
  </MasterLayout>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import MasterLayout from "@/components/layout/MasterLayout.vue";
import Breadcrumb from "@/components/layout/Breadcrumb.vue";
import ButtonComp from "@/components/ui/button.vue";
import { useRouter } from "vue-router";

import { formatDate, formatNumber } from "@/core/helpers/utility";
import type { SalesList } from "@/types/sales";
import { useSalesStore } from "@/stores/sales";
import LoadingComponent from "@/components/ui/loadingComponent.vue";

const store = useSalesStore();
const recordList = ref<Array<SalesList>>([]);
const modalOpen = ref<boolean>(false);
const loading = ref<boolean>(false);
const query = ref<string>("");
const searchedQuery = ref<string>("");
const isQueried = ref<boolean>(false);
const router = useRouter();
async function getRecordList() {
  loading.value = true;
  isQueried.value = false;
  query.value = "";
  await store
    .getHomePageSalesRecord()
    .then((response: any) => {
      recordList.value = response;
    })
    .finally(() => {
      loading.value = false;
    });
}
async function getSearchedRecordList() {
  searchedQuery.value = query.value;
  isQueried.value = true;
  loading.value = true;
  if (query.value.trim() == "") {
    getRecordList();
  } else {
    await store
      .searchSalesRecord(query.value)
      .then((response: any) => {
        recordList.value = response;
      })
      .finally(() => {
        loading.value = false;
      });
  }
}
function goToSalesDetails(event: any) {
  const salesId = event.data.saleKey;
  router.push(`/sales-record-detail/${salesId}`);
}
getRecordList();
</script>
<style scoped>
::v-deep(.p-datatable-scrollable-body) {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
::v-deep(.p-datatable-scrollable-body::-webkit-scrollbar) {
  display: none;
}
</style>
