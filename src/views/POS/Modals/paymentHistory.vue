<template>
  <div id="components-modal-demo-position">
    <a-modal
      v-model:open="props.paymentModalOpen"
      title="Payment History"
      width="30%"
      style="left: 10%"
      :footer="null"
      @cancel="closeModal"
    >
      <section class="text-base w-full mt-6">
        <!-- <div class="flex flex-col gap-y-2 mb-9">
          <p class="text-black-200">Product Name</p>
          <p class="text-2xl font-semibold">
            {{ deliveryHistory.productName }}
          </p>
        </div> -->
        <div class="flex justify-between bg-[#DCE3E780] rounded-xl px-4 py-5">
          <div class="flex flex-col gap-y-3">
            <p>Total Amount Due</p>
            <p class="text-4xl font-semibold text-primary">
              {{ formatNumber(paymentHistory.totalAmountDue, 2) }}
            </p>
          </div>
          <div class="flex flex-col gap-y-1 text-right">
            <p class="text-xs">Amount Paid</p>
            <p class="text-sm text-primary">
              {{ formatNumber(paymentHistory.amountPaid, 2) }}
            </p>
            <p class="text-xs">Outstanding</p>
            <p class="text-sm text-error-500">
              {{ formatNumber(paymentHistory.outstandingPayment, 2) }}
            </p>
          </div>
        </div>
        <div v-if="!isRecord">
          <div
            class="p-2 w-[100%] mt-6 border-b border-black-50"
            v-for="item in paymentHistory.salePayments"
            :key="item.salePaymentKey"
          >
            <div class="flex justify-between mb-2">
              <p>{{ formatNumber(item.amountPaid, 2) }}</p>
              <p>{{ item.paymentMethod.method }}</p>
            </div>

            <p class="text-sm text-lightgray">
              {{ formatDateTime(item.dateRecorded) }}
            </p>
          </div>

          <ButtonComp
            :type="'primary'"
            class="w-full h-12 mt-20"
            @click="isRecord = true"
          >
            Record Payment
          </ButtonComp>
        </div>

        <div class="w-full mt-6" v-if="isRecord">
          <div class="w-full mb-6">
            <Dropdown
              :buttonText="'Payment Method'"
              :hasSearch="false"
              :isOverlay="true"
              :label="'Payment Method '"
              :options="paymentMethodDropdown"
              v-model="paymentData.paymentModeKey"
            ></Dropdown>
          </div>
          <label class="text-base"
            >How Much Was Paid? <span class="text-error-500">*</span></label
          >
          <div class="flex gap-x-4">
            <CurrencyInput v-model="paymentData.amountPaid" />
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
                formatNumber(
                  paymentHistory.outstandingPayment - paymentData.amountPaid,
                  2
                )
              }}
            </p>
          </div>
          <div>
            <p class="mb-2">Payment Date<span class="text-error">*</span></p>
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
              :type="recordPaymentLoading ? 'primary-disabled' : 'primary'"
              class="w-full h-12 mt-14"
              @click="recordPayment"
            >
              <span v-if="recordPaymentLoading">Processing...</span>
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
import type { SalesDetail, paymentMethods } from "@/types/sales";
import { formatDateTime, formatNumber } from "@/core/helpers/utility";
import SuccessModal from "@/components/ui/modals/successModal.vue";
import { useSalesStore } from "@/stores/sales";
import { useRoute } from "vue-router";
import moment from "moment";
const route = useRoute();
interface paymentRecord {
  saleKey: string;
  paymentModeKey: string;
  amountPaid: 0;
  datePaid: string;
}
const paymentData = ref<paymentRecord>({
  saleKey: "",
  paymentModeKey: "",
  amountPaid: 0,
  datePaid: "",
});
const store = useSalesStore();
const paymentMethods = ref<Array<paymentMethods>>([]);
const recordPaymentLoading = ref<boolean>(false);
const isRecord = ref<boolean>(false);
const isSuccessModalVisible = ref<boolean>(false);
const modalMessage = ref<string>("");
const paymentMethodDropdown = computed(() => {
  return paymentMethods.value.map((item) => ({
    label: item.displayName,
    value: item.paymentModeKey,
  }));
});
const transactionDateModel = computed({
  get() {
    return paymentData.value.datePaid
      ? new Date(paymentData.value.datePaid)
      : null;
  },
  set(val: Date | null) {
    paymentData.value.datePaid = val ? moment(val).format("YYYY-MM-DD") : "";
  },
});
// Define props
const props = defineProps<{
  paymentModalOpen: boolean;
  paymentHistory: SalesDetail;
}>();
const emit = defineEmits(["paymentModalClose", "reload"]);
const closeModal = () => {
  isRecord.value = false;
  emit("paymentModalClose");
};

async function recordPayment() {
  paymentData.value.saleKey = String(route.params.id);

  if (
    !paymentData.value.paymentModeKey ||
    !paymentData.value.amountPaid ||
    !paymentData.value.datePaid
  ) {
    return;
  }
  recordPaymentLoading.value = true;
  await store
    .recordPayment(paymentData.value)
    .then(async (response: any) => {
      isSuccessModalVisible.value = true;
      modalMessage.value = "Payment was added successfully";
      closeModal();
      emit("reload");
      paymentData.value = {
        saleKey: "",
        paymentModeKey: "",
        amountPaid: 0,
        datePaid: "",
      };
    })
    .finally(() => (recordPaymentLoading.value = false));
}
async function getPaymentMethodList() {
  await store.getPaymentMethod().then((response: any) => {
    paymentMethods.value = response;
  });
}
getPaymentMethodList();
</script>
