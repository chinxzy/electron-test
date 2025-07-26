<template>
  <MasterLayout>
    <template #breadcrumb>
      <Breadcrumb :breadcrumbs="[{ label: 'POS', path: '/pos' }]" />
    </template>
    <section>
      <div
        class="flex items-center gap-x-2 mb-14 w-fit"
        @click="$router.back()"
      >
        <img src="/images/chevron-left.svg" alt="" />
        <p class="mb-0 text-textGray text-sm">
          Home / Record Sale/ Preview Sales Record
        </p>
      </div>
      <div class="flex justify-between mb-9">
        <div class="flex flex-col gap-y-5">
          <p>Transaction date</p>
          <div class="flex items-center gap-x-1">
            <img src="/images/calender.svg" alt="" />
            <p class="font-bold text-lg">{{ salesItemData.transactionDate }}</p>
          </div>
        </div>
        <div class="flex flex-col gap-y-5">
          <p>Customer</p>
          <p class="font-bold text-lg">{{ customerName }}</p>
        </div>
      </div>
      <div class="border border-black-100 rounded-xl p-6">
        <div class="font-medium text-[18px]">Products</div>
        <DataTable :value="salesItemData.saleProducts">
          <Column field="" header="" class="p-6">
            <template #body="data">
              <section class="py-3">
                <p class="text-2xl font-medium text-[#000] leading-[145%]">
                  {{ data.data.productName }}
                </p>
                <div class="flex gap-x-4 text-lessEmphasis mt-2">
                  <p>
                    Quantity: {{ data.data.quantity }}
                    {{ data.data.measurementUnitName }}
                  </p>
                  <span>|</span>
                  <p>SalesPrice: {{ formatNumber(data.data.salesPrice, 2) }}</p>
                  <div v-if="data.data.isVATable" class="flex gap-x-4">
                    <span>|</span>
                    <p>VAT: {{ formatNumber(data.data.calculatedVat, 2) }}</p>
                    <span>|</span>
                    <p>
                      Amount Due:
                      {{
                        formatNumber(
                          data.data.salesPrice + data.data.calculatedVat,
                          2
                        )
                      }}
                    </p>
                  </div>
                </div>
              </section>
            </template>
          </Column>
        </DataTable>
      </div>
      <div class="mt-12 grid grid-cols-2 w-full gap-x-12">
        <div class="w-full">
          <div class="p-6 border border-[#DCE3E780] rounded-xl w-full">
            <div class="flex mb-3 items-center justify-between">
              <p class="text-[#666666] font-semibold">Note</p>
            </div>
            {{ salesItemData.note }}
          </div>
        </div>
        <div
          class="bg-[#FAFAFA] p-6 flex flex-col gap-y-6 font-medium text-2xl rounded-xl"
        >
          <div class="flex justify-between gap-x-3">
            <p class="mb-0 text-black-100">Total Amount</p>
            <p class="mb-0 text-black-500 text-right">
              {{ formatNumber(totalSalesPrice, 2) }}
            </p>
          </div>

          <div class="flex justify-between gap-x-3">
            <p class="mb-0 text-black-100">VAT (7.5%)</p>
            <p class="mb-0 text-black-500 text-right">
              {{ formatNumber(totalVat, 2) }}
            </p>
          </div>
          <div class="flex justify-between gap-x-3">
            <p class="mb-0 font-bold">Total Amount Due</p>
            <p class="mb-0 font-bold text-right">
              {{ formatNumber(totalAmount, 2) }}
            </p>
          </div>
        </div>
      </div>
      <div class="flex justify-end items-center">
        <ButtonComp
          :type="recordSalesLoading ? 'primary-disabled' : 'primary'"
          class="w-[430px] h-14 mt-9 mb-20"
          @click="salesRecordSuccess = true"
        >
          <span>Submit Sales Record</span>
        </ButtonComp>
      </div>

      <div id="components-modal-demo-position">
        <a-modal
          v-model:open="salesRecordSuccess"
          title=""
          width="30%"
          style="left: 10%"
          :closable="false"
          :footer="null"
        >
          <div class="flex justify-center w-full p-4">
            <div class="text-center w-full">
              <img src="/images/files.svg" alt="" class="mx-auto w-[138px]" />
              <p class="font-semibold text-2xl mt-6 mb-4">
                Suubmit Sales Record
              </p>
              <p class="mb-6">
                Are you sure you want to submit this sales record
              </p>
              <div class="flex gap-x-6">
                <ButtonComp
                  :type="recordSalesLoading ? 'primary-disabled' : 'primary'"
                  class="w-full h-12"
                  @click="recordSales"
                >
                  <span v-if="recordSalesLoading">Processing...</span>
                  <span v-else>Yes, Submit</span>
                </ButtonComp>
                <ButtonComp
                  type="error"
                  class="w-full h-12"
                  @click="salesRecordSuccess = false"
                >
                  No, Cancel
                </ButtonComp>
              </div>
            </div>
          </div>
        </a-modal>
      </div>
    </section>
  </MasterLayout>
</template>
<script lang="ts" setup>
import MasterLayout from "@/components/layout/MasterLayout.vue";
import { ref, computed, watch } from "vue";
import { formatNumber } from "@/core/helpers/utility";
import { useSalesStore } from "@/stores/sales";
import type { SaleProducts } from "@/types/sales";
import type { CustomerList } from "@/types/customer";
import { useCustomerStore } from "@/stores/customer";

import { useRouter } from "vue-router";
const salesItemData = JSON.parse(localStorage.getItem("salesPreview") || "{}");
const recordSalesLoading = ref<boolean>(false);
const salesRecordSuccess = ref<boolean>(false);
const customerList = ref<Array<CustomerList>>([]);
const salesStore = useSalesStore();
const router = useRouter();
const customerStore = useCustomerStore();
// const customerName = ref<string>("");

// Initialize salesProductArray from salesItemData.saleProducts or as an empty array
const salesProductArray = ref<SaleProducts[]>(salesItemData.saleProducts || []);

const totalSalesPrice = computed<number>(() => {
  return salesItemData.saleProducts.reduce(
    (sum: any, item: any) => sum + item.salesPrice,
    0
  );
});
const totalVat = computed<number>(() => {
  return salesItemData.saleProducts.reduce(
    (sum: any, item: any) => sum + item.calculatedVat,
    0
  );
});
const customerName = computed<string>(() => {
  const customer = customerList.value.find(
    (item: any) => item.customerKey === salesItemData.customerKey
  );
  return customer ? customer.customerName : "";
});
const totalAmount = computed<number>(() => {
  return totalSalesPrice.value + totalVat.value;
});

async function recordSales() {
  recordSalesLoading.value = true;

  const { temporaryProp, ...cleanData } = salesItemData;

  cleanData.saleProducts = (cleanData.saleProducts || []).map(
    (item: {
      measurementUnitName: string;
      salesPrice: number;
      calculatedVat: number;
      [key: string]: any;
    }) => {
      const { measurementUnitName, salesPrice, calculatedVat, ...rest } = item;
      return rest;
    }
  );
  //   console.log("cleaned data", cleanData);

  await salesStore
    .recordSales(cleanData)
    .then(async (response: any) => {
      // Ensure response is an ArrayBuffer or valid Blob source
      const base64 = await blobToBase64(response);

      localStorage.setItem("sales-receipt", base64);
      // localStorage.setItem("sales-receipt", base64);
      router.push("/sales-success");
    })
    .finally(() => (recordSalesLoading.value = false));
}
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result); // This is a full data URL, like "data:application/pdf;base64,..."
    };

    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function getCustomerRecordList() {
  await customerStore.getCustomerList().then((response: any) => {
    customerList.value = response;
  });
}

// watch(
//   salesItemData,
//   (newVal) => {
//     customerName.value =
//       salesItemData.saleProducts.find(
//         (item: any) => item.customerKey === salesItemData.customerKey
//       )?.name || "";
//   },
//   {
//     deep: true,
//   }
// );
getCustomerRecordList();
</script>
