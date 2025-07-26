<template>
  <div id="components-modal-demo-position">
    <a-modal
      v-model:open="props.modal2Visible"
      title="Create Product"
      width="60%"
      style="left: 10%"
      :footer="null"
      @cancel="closeModal"
    >
      <div>
        <p>Enter detail of the product you want to create</p>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Product Type <span class="text-red-500">*</span>
          </label>
          <div
            class="flex border border-dashed border-gray-300 rounded-lg overflow-hidden p-2"
          >
            <div
              v-for="option in productOptions"
              :key="option.value"
              class="flex-1 p-2 cursor-pointer transition-colors rounded-lg"
              :class="{
                'bg-gray-100 border-primary': selectedType === option.value,
                'hover:bg-gray-50': selectedType !== option.value,
              }"
              @click="selectedType = option.value"
            >
              <div class="flex items-center">
                <span
                  class="w-5 h-5 border-2 mr-4 rounded-full flex items-center justify-center"
                  :class="{
                    'border-primary': selectedType === option.value,
                    'border-gray-400': selectedType !== option.value,
                  }"
                >
                  <div
                    v-if="selectedType === option.value"
                    class="w-3 h-3 bg-primary rounded-full"
                  ></div>
                </span>
                <div class="">
                  <span class="font-medium text-gray-900">{{
                    option.label
                  }}</span>
                  <p class="text-sm text-gray-500 mt-1 mb-0">
                    {{ option.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-x-6">
          <div class="flex flex-col gap-y-6">
            <div class="w-full">
              <label class="text-base"
                >{{
                  selectedType == "goods" ? "Product Name" : "Service Name"
                }}
                <span class="text-error-500">*</span></label
              >
              <input
                type="text"
                v-model="productData.name"
                class="w-full px-2 py-1 outline-[#DCE3E780] border border-[#DCE3E780] h-14 required mt-3 rounded-lg"
                placeholder="Enter product name"
              />
              <InputError v-if="!productData.name && buttonClicked">
                <p class="mb-0" v-if="!productData.name">
                  Product name is required
                </p>
              </InputError>
            </div>

            <div class="w-full">
              <label class="text-base"
                >Unit Price <span class="text-error-500">*</span></label
              >
              <input
                type="text"
                v-model="productData.unitPrice"
                class="w-full px-2 py-1 outline-[#DCE3E780] h-14 required mt-3 border border-[#DCE3E780] rounded-lg"
                placeholder="Enter unit price"
              />
              <InputError v-if="!productData.unitPrice && buttonClicked">
                <p class="mb-0" v-if="!productData.unitPrice">
                  Unit price is required
                </p>
              </InputError>
            </div>
            <div class="w-full" v-if="selectedType != 'service'">
              <label class="text-base">Barcode Number</label>
              <div class="flex gap-x-4">
                <Barcode v-model="productData.barCode" />
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-y-6">
            <div class="w-full">
              <Dropdown
                :buttonText="'Select measurement unit'"
                :hasSearch="true"
                :isOverlay="true"
                required
                :options="measurementDropdown"
                :label="'Measurement Unit'"
                v-model="productData.measurementUnitKey"
              ></Dropdown>
              <InputError
                v-if="!productData.measurementUnitKey && buttonClicked"
              >
                <p class="mb-0" v-if="!productData.measurementUnitKey">
                  Measurement unit is required
                </p>
              </InputError>
            </div>

            <div class="w-full">
              <Dropdown
                :buttonText="'Select product group'"
                :hasSearch="false"
                :isOverlay="true"
                :options="productGroupDropdown"
                :label="'Product Group'"
                v-model="productData.productGroupKey"
              ></Dropdown>
            </div>
          </div>
        </div>
        <div class="others mt-6">
          <div
            class="flex items-center gap-x-14"
            v-if="selectedType != 'service'"
          >
            <p class="mb-0">Allow Oditor monitor your stock quantity</p>
            <Switch v-model="stockQuantity" />
          </div>
          <div
            v-if="stockQuantity && selectedType != 'service'"
            class="grid grid-cols-2 gap-x-6 border-dashed border rounded-lg border-[#B0B0B0] p-2 mt-4"
          >
            <div class="w-full">
              <label class="text-base"
                >What is the current quantity of the product?</label
              >
              <input
                type="number"
                v-model="productData.initialQuantity"
                class="w-full px-2 py-1 outline-[#DCE3E780] h-14 required mt-3 border border-[#DCE3E780] rounded-lg"
                placeholder="Enter quantity"
              />
            </div>
            <div class="w-full">
              <div class="flex justify-between items-center">
                <label class="text-base"
                  >Notify me when quantity drops to</label
                >
                <Switch v-model="productData.notifyAboutReorderLevel" />
              </div>

              <input
                type="number"
                v-model="productData.reorderLevel"
                class="w-full px-2 py-1 outline-[#DCE3E780] h-14 required mt-3 border border-[#DCE3E780] rounded-lg"
                placeholder="Reorder quantity"
                :disabled="!productData.notifyAboutReorderLevel"
              />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-x-6">
            <div class="mt-6">
              <div class="w-full">
                <label class="text-base">Product Description</label>
                <textarea
                  type="text"
                  v-model="productData.description"
                  rows="10"
                  cols="30"
                  class="w-full px-2 py-1 outline-[#DCE3E780] h-20 required mt-3 border border-[#DCE3E780] rounded-lg"
                  placeholder="Describe your products"
                ></textarea>
              </div>
              <div class="flex items-center gap-x-14 mt-6">
                <p class="mb-0">Do you collect VAT (7.5%) on this product</p>
                <Switch v-model="productData.isVATable" />
              </div>
            </div>
          </div>
          <p
            class="text-textGray mt-4"
            v-if="productData.isVATable && userVatType == null"
          >
            Select how you want your tax to be applied to your goods and
            services
          </p>
          <div
            v-if="productData.isVATable && userVatType == null"
            class="grid grid-cols-2 space-x-6 mt-6"
          >
            <div
              v-for="option in vatOptions"
              :key="option.value"
              class="cursor-pointer"
              @click="productData.vatType = option.value"
            >
              <!-- Custom Radio Button -->
              <div class="flex items-start space-x-3 mb-2.5">
                <div
                  class="w-5 h-5 border-2 rounded-full flex items-center justify-center"
                  :class="{
                    'border-primary': productData.vatType === option.value,
                    'border-gray-400': productData.vatType !== option.value,
                  }"
                >
                  <div
                    v-if="productData.vatType === option.value"
                    class="w-3 h-3 bg-primary rounded-full"
                  ></div>
                </div>

                <!-- Text Content -->
                <div>
                  <span class="font-medium text-gray-900">{{
                    option.label
                  }}</span>
                </div>
              </div>
              <p
                class="mt-1 text-sm text-lessEmphasis bg-nurseryGreen-10 p-2 rounded-lg"
              >
                {{ option.description }}
              </p>
            </div>
          </div>
          <div class="flex justify-center">
            <ButtonComp
              :type="addProductLoading ? 'primary-disabled' : 'primary'"
              class="w-[430px] h-12 mt-9"
              @click="addProduct"
            >
              <span v-if="addProductLoading">Processing...</span>
              <span v-else>Create Product</span>
            </ButtonComp>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref, defineProps, watch, computed, defineEmits } from "vue";
import {
  DefaultCreateProduct,
  DefaultCreateProductService,
  DefaultCreateProductWithoutInventory,
} from "@/types/product";
import type { ProductGroupList, MeasurementUnit } from "@/types/product";
import { usePoductStore } from "@/stores/product";
import { openNotificationWithIcon } from "@/core/helpers/utility";
import Barcode from "@/components/ui/barcode.vue";
import type {
  createProduct,
  createProductService,
  createProductWithoutInventory,
} from "@/types/product";
import InputError from "@/components/ui/inputError.vue";
interface Option {
  label: string;
  value: string;
  description: string;
}

// Define props
const props = defineProps<{
  modal2Visible: boolean;
  productGroups?: ProductGroupList[];
}>();
const emit = defineEmits(["closeModal2", "reload"]);
const closeModal = () => {
  emit("closeModal2");
};
const store = usePoductStore();
const stockQuantity = ref(true);
const quantityDrop = ref(false);
const isVATable = ref(false);
const selectedType = ref<string>("goods");
const createType = ref<string>("goods");
const selectedVAT = ref<string>("exclusive");
const userVatType = ref<any>(null);
const addProductLoading = ref(false);
const measurementList = ref<Array<MeasurementUnit>>([]);
const buttonClicked = ref<boolean>(false);
const productGroupDropdown = computed(() => {
  return (props.productGroups ?? []).map((item) => ({
    label: item.productGroupName,
    value: item.productGroupKey,
  }));
});

const measurementDropdown = computed(() => {
  return measurementList.value.map((item) => ({
    label: item.name,
    value: item.measurementUnitKey,
  }));
});

const productOptions: Option[] = [
  {
    label: "Goods",
    value: "goods",
    description: "Products you bought or manufactured to sell",
  },
  {
    label: "Service",
    value: "service",
    description: "Hairstyling, consulting, cleaning... etc",
  },
];
const vatOptions: Option[] = [
  {
    label: "Exclusive VAT",
    value: "exclusive",
    description:
      "Exclusive means, the VAT is not included in the product selling price and is calculated differently.",
  },
  {
    label: "Inclusive VAT",
    value: "inclusive",
    description:
      "Inclusive means the VAT has already been included in the product selling price and is not calculated differently when recording sale, invoice and receipt for the customer.",
  },
];

const validations = computed(() => [
  {
    condition: !productData.value.name,
    message: "Product name is required",
  },
  {
    condition: !productData.value.unitPrice,
    message: "Unit price is required",
  },
  {
    condition: !productData.value.measurementUnitKey,
    message: "Measurement unit is required",
  },
]);
const productData = ref<createProduct>({
  ...DefaultCreateProduct,
});
const productServiceData = ref<createProductService>({
  ...DefaultCreateProduct,
});
const productWithoutInventoryData = ref<createProductWithoutInventory>({
  ...DefaultCreateProductWithoutInventory,
});
async function getMeasurementUnitList() {
  await store.getMeasurementUnits().then((response: any) => {
    measurementList.value = response;
  });
}

async function addProduct() {
  buttonClicked.value = true;

  for (const { condition, message } of validations.value) {
    if (condition) {
      return;
    }
  }
  addProductLoading.value = true;
  let data;
  if (createType.value == "goods") {
    data = { ...productData.value };
  } else if (createType.value == "service") {
    data = { ...productServiceData.value };
  } else if (createType.value == "goodsWithoutInventory") {
    data = { ...productWithoutInventoryData.value };
  }
  await store
    .createProducts(data, createType.value)
    .then((response: any) => {
      productData.value = { ...DefaultCreateProduct };
      productServiceData.value = { ...DefaultCreateProduct };
      productWithoutInventoryData.value = {
        ...DefaultCreateProductWithoutInventory,
      };
      // openNotificationWithIcon("success", null, response.message);
      emit("reload");
    })
    .finally(() => {
      addProductLoading.value = false;
    });
}
function getLocalStorageData() {
  const localStorageData = localStorage.getItem("auth-user");
  console.log("localStorageData", localStorageData);
  if (localStorageData) {
    const parsedData = JSON.parse(localStorageData);
    console.log("parsedData", parsedData);
    userVatType.value = parsedData.profileInfo.vatApplicationType;
  }
}
watch(selectedType, () => {
  if (selectedType.value == "goods") {
    createType.value = "goods";
  } else if (selectedType.value == "service") {
    createType.value = "service";
  }
});
watch(stockQuantity, () => {
  if (selectedType.value == "goods" && stockQuantity.value == false) {
    createType.value = "goodsWithoutInventory";
  } else {
    createType.value = "goods";
  }
});
watch(userVatType, () => {
  if (userVatType.value != null) {
    productData.value.vatType = userVatType.value;
    productServiceData.value.vatType = userVatType.value;
    productWithoutInventoryData.value.vatType = userVatType.value;
  }
});
watch(
  productData,
  (newVal) => {
    // Update productServiceData
    productServiceData.value.name = newVal.name;
    productServiceData.value.measurementUnitKey = newVal.measurementUnitKey;
    productServiceData.value.unitPrice = newVal.unitPrice;
    productServiceData.value.description = newVal.description;
    productServiceData.value.productGroupKey = newVal.productGroupKey;
    productServiceData.value.isVATable = newVal.isVATable;
    productServiceData.value.vatType = newVal.vatType;

    // Update productWithoutInventoryData
    productWithoutInventoryData.value.name = newVal.name;
    productWithoutInventoryData.value.measurementUnitKey =
      newVal.measurementUnitKey;
    productWithoutInventoryData.value.unitPrice = newVal.unitPrice;
    productWithoutInventoryData.value.isVATable = newVal.isVATable;
    productWithoutInventoryData.value.description = newVal.description;
    productWithoutInventoryData.value.productGroupKey = newVal.productGroupKey;
    productWithoutInventoryData.value.barCode = newVal.barCode;
    productWithoutInventoryData.value.vatType = newVal.vatType;
  },
  { deep: true }
);

getMeasurementUnitList();
getLocalStorageData();
</script>
<style scoped>
.border-primary {
  border-color: #0099a8;
}
.bg-primary {
  background-color: #0099a8;
}
</style>
