<template>
  <div id="components-modal-demo-position">
    <a-modal
      v-model:open="props.detailModalOpen"
      title="Product Item Detail"
      width="30%"
      style="left: 10%"
      :footer="null"
      @cancel="closeModal"
    >
      <section>
        <div
          class="flex justify-between mb-6 border-b border-[#DCE3E780] text-[18px] mt-9"
        >
          <p class="text-black-200">Product Name</p>
          <p>{{ props.products.productName }}</p>
        </div>
        <div
          class="flex justify-between mb-6 border-b border-[#DCE3E780] text-[18px]"
        >
          <p class="text-black-200">Unit Price</p>
          <p>{{ formatNumber(props.products.unitPrice, 2) }}</p>
        </div>
        <div
          class="flex justify-between mb-6 border-b border-[#DCE3E780] text-[18px]"
        >
          <p class="text-black-200">Quantity Purchased</p>
          <p>
            {{ props.products.quantityPurchased }}
            {{
              props.products.quantityPurchased > 1
                ? props.products.measurementNames.plural
                : props.products.measurementNames.single
            }}
          </p>
        </div>
        <div
          class="flex justify-between mb-6 border-b border-[#DCE3E780] text-[18px]"
        >
          <p class="text-black-200">Sale Price</p>
          <p>
            {{
              formatNumber(
                props.products.unitPrice * props.products.quantityPurchased,
                2
              )
            }}
          </p>
        </div>
        <div
          class="flex justify-between mb-6 border-b border-[#DCE3E780] text-[18px]"
        >
          <p class="text-black-200">VAT (7.5%)</p>
          <p>{{ formatNumber(props.products.vat, 2) ?? "--" }}</p>
        </div>
        <div
          class="flex justify-between mb-6 border-b border-[#DCE3E780] text-[18px]"
        >
          <p class="text-black-200">Discount</p>
          <p>{{ formatNumber(props.products.discount, 2) }}</p>
        </div>
        <div
          v-if="props.products.discount != 0"
          class="flex justify-between mb-6 border-b border-[#DCE3E780] text-[18px]"
        >
          <p class="text-black-200">Discounted Price</p>
          <p>{{ formatNumber(props.products.salePrice, 2) }}</p>
        </div>
      </section>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref, defineProps, watch, computed, defineEmits } from "vue";
import { formatNumber } from "@/core/helpers/utility";

// Define props
const props = defineProps<{
  detailModalOpen: boolean;
  products: {
    productName: string;
    salePrice: number;
    quantityPurchased: number;
    vat: number;
    totalAmount: number;
    unitPrice: number;
    discount: number;
    discountPercentage: number;
    measurementNames: {
      single: string;
      plural: string;
    };
  };
}>();
const emit = defineEmits(["detailModalClose", "reload"]);
const closeModal = () => {
  emit("detailModalClose");
};
</script>
