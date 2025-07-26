import { ref, computed } from "vue";
import { defineStore } from "pinia";

import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";

import type { initializePayment } from "@/types/subscription";

export type subscriptionCredentials = {
  businessKey: string;
  subscriptionPaymentInvoiceKey: string;
};

export const useSubscriptionStore = defineStore("subscription", () => {
  function getSubDetail(credentials: subscriptionCredentials) {
    return ApiService.get(
      `web/subscription-payment-invoice-detail?businessKey=${credentials.businessKey}&subscriptionPaymentInvoiceKey=${credentials.subscriptionPaymentInvoiceKey}`
    )
      .then(({ data }) => {
        return data;
      })
      .catch((response) => {
        throw response;
      });
  }

  function initializeSubPayment(credentials: initializePayment) {
    return ApiService.post(
      "web/initialize-subscription-payment-invoice-transaction",
      credentials
    )
      .then(({ data }) => {
        return data;
      })
      .catch((response) => {
        throw response;
      });
  }

  return {
    getSubDetail,
    initializeSubPayment,
  };
});
