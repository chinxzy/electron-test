<template>
  <div class="md:h-screen md:flex min-h-screen">
    <div
      class="flex-none w-2/5 bg-signup-image bg-cover bg-no-repeat md:block hidden bg-center"
    ></div>
    <div class="md:px-20 px-6 py-14 md:w-33rem mx-auto">
      <div class="mb-8">
        <img src="../../assets/icons/Layer_x0020.svg" alt="" class="mx-auto" />
      </div>
      <div class="heading text-center mb-14 text-3xl font-bold">
        <p>Subscription</p>
      </div>
      <LoadingComponent v-if="LoadingDetails" />
      <div
        v-else
        class="border border-[#E8E8E8] rounded-lg md:border-none py-6 px-4 md:px-0 md:py-0"
      >
        <div
          class="paymentType flex items-center justify-center gap-x-4 mb-8 font-medium text-[18px]"
        >
          <p
            class="mb-0"
            :class="!yearly ? 'text-[#001928]' : 'text-[#B0B0B0]'"
          >
            Pay Monthly
          </p>
          <div class="flex items-center">
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer" v-model="yearly" />
              <div
                class="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary transition-colors"
              ></div>
              <div
                class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform transform peer-checked:translate-x-5"
              ></div>
            </label>
          </div>
          <p class="mb-0" :class="yearly ? 'text-[#001928]' : 'text-[#B0B0B0]'">
            Save With Yearly
          </p>
        </div>

        <div class="contents space-y-4">
          <p class="text-primary text-lg">
            {{ subscriptionDetails?.businessName }}
          </p>
          <div class="flex justify-between">
            <p class="text-sm text-lightgray">Subscription Plan</p>
            <p class="text-lg">
              {{ subscriptionDetails?.subscriptionPlan }} Plan
            </p>
          </div>
          <div class="flex justify-between">
            <p class="text-sm text-lightgray">Service Period</p>
            <p class="text-lg">
              {{
                yearly
                  ? subscriptionDetails?.paymentType[1].servicePeriod
                  : subscriptionDetails?.paymentType[0].servicePeriod
              }}
            </p>
          </div>
          <div class="flex justify-between">
            <p class="text-sm text-lightgray">Amount</p>

            <p class="text-2xl text-primary font-bold">
              ₦
              {{
                yearly
                  ? formatNumber(subscriptionDetails?.paymentType[1].price, 0)
                  : formatNumber(subscriptionDetails?.paymentType[0].price, 0)
              }}
            </p>
          </div>
        </div>
        <ButtonComp
          :type="LoadingPayment ? 'primary-disabled' : 'primary'"
          class="w-full h-12 mt-9"
          @click="initializePayment"
        >
          <span v-if="LoadingPayment">Processing...</span>
          <span v-else>Make Payment</span>
        </ButtonComp>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
declare global {
  interface Window {
    PaystackPop?: any;
  }
}
import { onMounted, ref, watch } from "vue";
import { useSubscriptionStore } from "@/stores/subscription";
import { useRoute, useRouter } from "vue-router";
import {
  defaultSubscriptionCredentails,
  DefaultSubscriptionDetails,
  defaultInitializePayment,
  DefautSubscriptionDetailsPaymentType,
} from "@/types/subscription";
import { formatNumber } from "@/core/helpers/utility";
import LoadingComponent from "@/components/ui/loadingComponent.vue";

const route = useRoute();
const router = useRouter();
const yearly = ref<boolean>(false);
const LoadingDetails = ref<boolean>(false);
const LoadingPayment = ref<boolean>(false);
const store = useSubscriptionStore();
const subscriptionCredentials = ref({ ...defaultSubscriptionCredentails });
const subscriptionDetails = ref({ ...DefaultSubscriptionDetails });
const paymentCredentials = ref({ ...defaultInitializePayment });
const selectedPlan = ref({ ...DefautSubscriptionDetailsPaymentType });
const publicKey = import.meta.env.VITE_APP_PAYSTACK_PUBLICK_KEY;
const email = ref<String>("me@example.com");
const amount = ref<number>(1000);
const reference = ref<String>("");

onMounted(() => {
  if (!window.PaystackPop) {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.head.appendChild(script);
  }
});

const payWithPaystack = () => {
  const handler = (window as any).PaystackPop.setup({
    key: publicKey,
    email: email.value,
    amount: amount.value,
    currency: "NGN",
    ref,
    callback: (response: any) => {
      console.log("Payment successful", response);
      alert(`Payment Successful! Reference: ${response.reference}`);
      // Handle success (e.g., send confirmation to backend)
    },
    onClose: () => {
      alert("Transaction was not completed, window closed.");
    },
  });
  handler.openIframe();
};

function getRouteDetails() {
  subscriptionCredentials.value.businessKey = String(route.query.businessKey);
  paymentCredentials.value.businessKey = String(route.query.businessKey);

  subscriptionCredentials.value.subscriptionPaymentInvoiceKey = String(
    route.query.invoiceKey
  );
  paymentCredentials.value.subscriptionPaymentInvoiceKey = String(
    route.query.invoiceKey
  );
  paymentCredentials.value.businessUserKey = String(
    route.query.businessUserKey
  );
}
const getSubDetails = async () => {
  LoadingDetails.value = true;
  await store
    .getSubDetail(subscriptionCredentials.value)
    .then((response: any) => {
      subscriptionDetails.value = response;
      paymentCredentials.value.subscriptionPlan =
        subscriptionDetails.value.subscriptionPlan;
      if (yearly.value) {
        selectedPlan.value = subscriptionDetails.value.paymentType[1];
      } else {
        selectedPlan.value = subscriptionDetails.value.paymentType[0];
      }
      paymentCredentials.value.paymentTypePeriod =
        selectedPlan.value.paymentTypePeriod;
    })
    .catch(() => {
      router.push("/subscription-payment-invoice-fallback");
    })
    .finally(() => (LoadingDetails.value = false));
};

const initializePayment = async () => {
  LoadingPayment.value = true;
  await store
    .initializeSubPayment(paymentCredentials.value)
    .then((response: any) => {
      reference.value = response.reference;
      window.location.href = response.authorizationUrl;
      // payWithPaystack();
    })
    .finally(() => (LoadingPayment.value = false));
};

getRouteDetails();
getSubDetails();

watch(
  yearly,
  () => {
    if (yearly.value == true) {
      selectedPlan.value = subscriptionDetails.value.paymentType.find(
        (item: any) => item.paymentTypePeriod.toLocaleLowerCase() == "yearly"
      ) || { paymentTypePeriod: "", price: 0, servicePeriod: "" };
      paymentCredentials.value.paymentTypePeriod =
        selectedPlan.value.paymentTypePeriod;
    } else {
      selectedPlan.value = subscriptionDetails.value.paymentType.find(
        (item: any) => item.paymentTypePeriod.toLocaleLowerCase() == "monthly"
      ) || { paymentTypePeriod: "", price: 0, servicePeriod: "" };
      (item: any) => item.paymentTypePeriod.toLocaleLowerCase() == "monthly";
      paymentCredentials.value.paymentTypePeriod =
        selectedPlan.value.paymentTypePeriod;
    }
  },
  { immediate: true }
);
</script>
