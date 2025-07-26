<template>
  <MasterLayout>
    <template #breadcrumb>
      <Breadcrumb :breadcrumbs="[{ label: 'Product', path: '/pos' }]" />
    </template>
    <section class="">
      <div
        class="flex items-center gap-x-2 mb-6 cursor-pointer"
        @click="$router.back()"
      >
        <img src="/images/chevron-left.svg" alt="" />
        <p class="mb-0 text-textGray text-sm">
          Home / Products / {{ productDetails.name }}
        </p>
      </div>

      <div class="flex justify-between mb-[60px]">
        <p class="text-primary text-3xl">{{ productDetails.name }}</p>
      </div>

      <div class="grid grid-cols-2 gap-x-12">
        <!--details-->
        <div class="flex flex-col gap-y-5">
          <section class="w-full flex justify-between gap-x-[55px]">
            <div
              class="flex flex-col gap-y-2 font-light items-center shadow-[0px_1px_32px_0px_#00000014] py-6 w-[180px] px-9 rounded-lg"
            >
              <p class="text-black-200 font-light">Unit Price</p>
              <p>{{ formatNumber(productDetails.unitPrice, 0) }}</p>
            </div>

            <div
              class="flex flex-col gap-y-2 font-light items-center shadow-[0px_1px_32px_0px_#00000014] py-6 w-[180px] px-9 rounded-lg"
            >
              <p class="text-black-200 font-light">VAT</p>
              <p>{{ productDetails.collectVAT ? "7.5%" : "N/A" }}</p>
            </div>
            <div
              class="flex flex-col gap-y-2 font-light items-center shadow-[0px_1px_32px_0px_#00000014] py-6 w-[180px] px-9 rounded-lg"
            >
              <p class="text-black-200 font-light">Barcode</p>
              <p>{{ productDetails.barCode ?? "-" }}</p>
            </div>
          </section>

          <section>
            <p class="text-black-200 font-light">
              Notify me when item quantity drops to
              <span class="text-alternateBlack"
                >{{ productDetails.reorderLevel }}
                {{ productDetails.measurementNames?.plural }}</span
              >
            </p>
          </section>
          <section
            class="font-light pb-2 shadow-[0px_1px_32px_0px_#00000014] rounded-lg p-4"
          >
            <p class="text-black-200 mb-2">Item Description</p>
            <p class="text-alternateBlack">
              {{
                productDetails.description
                  ? productDetails.description
                  : "No description"
              }}
            </p>
          </section>
          <!-- <section>
            <ButtonComp
              :type="'primary-outline'"
              class="w-40 mt-9"
              @click="modalOpen = true"
            >
              <div class="flex items-center">
                <img src="/images/ion_cart-primary.svg" alt="" class="mr-2" />

                <p>Restock Item</p>
              </div>
            </ButtonComp>
          </section> -->
        </div>
        <!--activities-->
        <div class="shadow-[0px_1px_32px_0px_#00000014] rounded-lg p-4">
          <div class="flex justify-between w-full mb-6">
            <p class="text-gray font-semibold">Activities</p>
            <p class="font-light text-primary">View More</p>
          </div>
          <div
            v-for="activity in productDetails.activityLogs"
            :key="activity.activityDate"
            class="flex gap-x-7 w-full"
          >
            <div class="w-[30%]">
              <p class="text-sm text-alternateBlack mb-2">
                {{ formatDate(activity.activityDate, "DD/MM/YY") }}
              </p>
              <p class="text-sm text-gray">
                {{ formatDate(activity.activityDate, "h:mm:ss a") }}
              </p>
            </div>
            <div class="w-[70%] mt-2 text-sm">
              <p class="text-gray mb-4">{{ activity.logMessage }}</p>
              <div class="grid grid-cols-2">
                <div>
                  <p
                    v-if="productType == 'Goods'"
                    class="text-textGray mb-[6px]"
                  >
                    Qty before activity
                  </p>
                  <p class="text-alternateBlack">
                    {{ activity.quantityBeforeActivity }}
                  </p>
                </div>
                <div>
                  <p
                    v-if="productType == 'Goods'"
                    class="text-textGray mb-[6px]"
                  >
                    Qty after activity
                  </p>
                  <p class="text-gray">{{ activity.quantityAfterActivity }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--transactions-->
      <!-- <div class="transactions mt-12">
        <p class="font-medium text-xl">Product Transactions</p>
        <TableTab
          class="mt-6"
          :tabs="tabs"
          :active-tab="currentTab"
          container-class="bg-white p-4"
          tabs-container-class="border-b border-gray-300"
          tab-text-class=""
          @selectedTab="handleTabChange"
        />
      </div> -->
      <div>
        <RestockItem
          :modal2-visible="modalOpen"
          @close-modal2="modalOpen = false"
          @reload="getProductDetails, (modalOpen = false), getLastStcok"
        />
      </div>
    </section>
  </MasterLayout>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import MasterLayout from "@/components/layout/MasterLayout.vue";
import Breadcrumb from "@/components/layout/Breadcrumb.vue";
import { useRoute } from "vue-router";
import { usePoductStore } from "@/stores/product";
import type { ProductDetails, getLastRestockInfo } from "@/types/product";
import { formatDate, formatNumber } from "@/core/helpers/utility";
import TableTab from "@/components/ui/tab.vue";
import RestockItem from "./Modals/restockItem.vue";

const route = useRoute();
const store = usePoductStore();
const productDetails = ref<ProductDetails>({} as ProductDetails);
const lastRestockDetails = ref<getLastRestockInfo>({} as getLastRestockInfo);
const detailsLoading = ref(false);
const currentTab = ref("restockHistory");
const modalOpen = ref<boolean>(false);
const hasIncomingStock = route.query.incoming;
const productType = route.query.type;
const tabs = ref([
  {
    title: "Restock History",
    value: "restockHistory",
  },
  {
    title: "Goods Reduction",
    value: "goodsreduction",
  },
]);

async function getProductDetails() {
  detailsLoading.value = true;
  const productKey = route.params.id;
  const productName = decodeURIComponent(
    String(route.query.productName).replace(/%20/g, " ")
  );
  const productType = decodeURIComponent(
    String(route.query.type).replace(/%20/g, " ").toLocaleLowerCase()
  );
  await store
    .getProductDetails(String(productKey), String(productName), productType)
    .then((response) => {
      productDetails.value = response;
    })
    .finally(() => {
      detailsLoading.value = false;
    });
}

async function getLastStcok() {
  const productKey = route.params.id;

  await store
    .getLastRestockInfo(String(productKey))
    .then((response) => {
      lastRestockDetails.value = response;
    })
    .finally(() => {});
}

function handleTabChange(tab: string) {
  currentTab.value = tab;
}

watch(
  () => hasIncomingStock || false,
  (newValue) => {
    if (newValue) {
      getLastStcok();
    } else {
      // getIncomingStock()
    }
  },
  { immediate: true }
);
getProductDetails();
</script>
