<template>
  <div id="components-modal-demo-position">
    <a-modal
      v-model:open="props.deliveryModalOpen"
      title="Delivery History"
      width="30%"
      style="left: 10%"
      :footer="null"
      @cancel="closeModal"
    >
      <section class="text-base w-full mt-6">
        <div class="flex flex-col gap-y-2 mb-9">
          <p class="text-black-200">Product Name</p>
          <p class="text-2xl font-semibold">
            {{ deliveryHistory.productName }}
          </p>
        </div>
        <div class="flex justify-between bg-[#DCE3E780] rounded-xl px-4 py-5">
          <div class="flex flex-col gap-y-3">
            <p>Quantity Purchased</p>
            <p class="text-4xl font-semibold text-primary">
              {{ deliveryHistory.quantityPurchased }}
              {{
                deliveryHistory.quantityPurchased > 1
                  ? deliveryHistory.measurementNames.plural
                  : deliveryHistory.measurementNames.single
              }}
            </p>
          </div>
          <div class="flex flex-col gap-y-1 text-right">
            <p class="text-xs">Delivered</p>
            <p class="text-sm text-primary">
              {{ deliveryHistory.quantityDelivered }}
              {{
                deliveryHistory.quantityDelivered > 1
                  ? deliveryHistory.measurementNames.plural
                  : deliveryHistory.measurementNames.single
              }}
            </p>
            <p class="text-xs">Outstanding</p>
            <p class="text-sm text-error-500">
              {{
                deliveryHistory.quantityPurchased -
                deliveryHistory.quantityDelivered
              }}
              {{
                deliveryHistory.quantityPurchased -
                  deliveryHistory.quantityDelivered >
                1
                  ? deliveryHistory.measurementNames.plural
                  : deliveryHistory.measurementNames.single
              }}
            </p>
          </div>
        </div>
        <div v-if="!isRecord">
          <div
            class="p-2 w-[100%] flex justify-between mt-6 border-b border-black-50"
            v-for="item in deliveryHistory.saleProductDeliveries"
            :key="item.saleProductDeliveryKey"
          >
            <p>
              {{ item.quantityDelivered }}
              {{
                item.quantityDelivered > 1
                  ? deliveryHistory.measurementNames.plural
                  : deliveryHistory.measurementNames.single
              }}
            </p>
            <p class="text-sm text-lightgray">
              {{ formatDateTime(item.dateRecorded) }}
            </p>
          </div>
          <ButtonComp
            v-if="
              deliveryHistory.quantityPurchased -
                deliveryHistory.quantityDelivered !==
              0
            "
            :type="'primary'"
            class="w-full h-12 mt-20"
            @click="isRecord = true"
          >
            Record Delivery
          </ButtonComp>
        </div>

        <div class="w-full mt-6" v-if="isRecord">
          <label class="text-base"
            >Quantity Delivered<span class="text-error-500">*</span></label
          >
          <div class="flex gap-x-4 mt-3">
            <input
              type="number"
              class="w-full px-2 py-1 outline-[#DCE3E780] h-14 required border border-[#DCE3E780] rounded-lg"
              placeholder="Enter quantity"
              v-model="deliveryData.quantityDelivered"
            />
          </div>
          <!-- <InputError
                  v-if="!salesProductData.quantity && addButtonClicked"
                >
                  <p class="mb-0">Quantity is required</p>
                </InputError> -->
          <div class="flex gap-x-2 text-error-500 mt-6 mb-6">
            <img src="/images/bulb-red.svg" alt="" />
            <p>
              New Outstanding delivery of
              {{
                deliveryHistory.quantityPurchased -
                deliveryHistory.quantityDelivered -
                deliveryData.quantityDelivered
              }}
              {{
                deliveryHistory.quantityPurchased -
                  deliveryHistory.quantityDelivered -
                  deliveryData.quantityDelivered >
                1
                  ? deliveryHistory.measurementNames.plural
                  : deliveryHistory.measurementNames.single
              }}
            </p>
          </div>
          <div>
            <p class="mb-2">Delivery Date<span class="text-error">*</span></p>
            <VueDatePicker
              v-model="transactionDateModel"
              :enable-time-picker="false"
              auto-apply
              placeholder="Select Date"
              :max-date="new Date()"
            />
            <!-- <InputError
            v-if="!salesItemData.transactionDate && recoredButtonClicked"
          >
            <p class="mb-0">Transaction date is required</p>
          </InputError> -->

            <ButtonComp
              :type="recordDeliveryLoading ? 'primary-disabled' : 'primary'"
              class="w-full h-12 mt-14"
              @click="recordDelivery"
            >
              <span v-if="recordDeliveryLoading">Processing...</span>
              <span v-else>Yes, Submit</span>
            </ButtonComp>
          </div>
        </div>
      </section>
    </a-modal>
  </div>
  <SuccessModal
    :isVisible="isSuccessModalVisible"
    @closeIsVisible="isSuccessModalVisible = false"
    :message="modalMessage"
  />
</template>
<script lang="ts" setup>
import { ref, defineProps, watch, computed, defineEmits } from "vue";
import type { SaleRecordProducts } from "@/types/sales";
import { formatDateTime } from "@/core/helpers/utility";
import { useSalesStore } from "@/stores/sales";
import { useRoute } from "vue-router";
import SuccessModal from "@/components/ui/modals/successModal.vue";
import moment from "moment";
const route = useRoute();
interface deliveryRecord {
  saleKey: string;
  saleProductKey: string;
  quantityDelivered: number;
  dateDelivered: string;
}
const deliveryData = ref<deliveryRecord>({
  saleKey: "",
  saleProductKey: "",
  quantityDelivered: 0,
  dateDelivered: "",
});
const store = useSalesStore();
const recordDeliveryLoading = ref<boolean>(false);
const isSuccessModalVisible = ref<boolean>(false);
const modalMessage = ref<string>("");
const isRecord = ref<boolean>(false);

// Define props
const props = defineProps<{
  deliveryModalOpen: boolean;
  deliveryHistory: SaleRecordProducts;
}>();
const transactionDateModel = computed({
  get() {
    return deliveryData.value.dateDelivered
      ? new Date(deliveryData.value.dateDelivered)
      : null;
  },
  set(val: Date | null) {
    deliveryData.value.dateDelivered = val
      ? moment(val).format("YYYY-MM-DD")
      : "";
  },
});
const emit = defineEmits(["deliveryModalClose", "reload"]);
const closeModal = () => {
  isRecord.value = false;
  emit("deliveryModalClose");
};
async function recordDelivery() {
  deliveryData.value.saleKey = String(route.params.id);
  deliveryData.value.saleProductKey = props.deliveryHistory.saleProductKey;
  if (
    !deliveryData.value.quantityDelivered ||
    !deliveryData.value.dateDelivered
  ) {
    return;
  }
  recordDeliveryLoading.value = true;
  await store
    .recordDelivery(deliveryData.value)
    .then(async (response: any) => {
      isSuccessModalVisible.value = true;
      modalMessage.value = "Product delivery was updated successfully";
      closeModal();
      emit("reload");
      deliveryData.value = {
        saleKey: "",
        saleProductKey: "",
        quantityDelivered: 0,
        dateDelivered: "",
      };
    })
    .finally(() => (recordDeliveryLoading.value = false));
}
</script>
