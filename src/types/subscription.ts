export interface SubscriptionCredentails {
  businessKey: string;
  subscriptionPaymentInvoiceKey: string;
}

export const defaultSubscriptionCredentails: SubscriptionCredentails = {
  subscriptionPaymentInvoiceKey: "",

  businessKey: "",
};

export interface SubscriptionDetailsPaymentType {
  paymentTypePeriod: string;
  price: number;
  servicePeriod: string;
}
export const DefautSubscriptionDetailsPaymentType: SubscriptionDetailsPaymentType =
  {
    paymentTypePeriod: "",
    price: 0,
    servicePeriod: "",
  };
export interface SubscriptionDetails {
  subscriptionPaymentInvoiceKey: string;
  businessName: string;
  subscriptionPlan: string;
  currentPaymentTypePeriod: string;
  paymentType: SubscriptionDetailsPaymentType[];
}
export const DefaultSubscriptionDetails: SubscriptionDetails = {
  subscriptionPaymentInvoiceKey: "",
  businessName: "",
  subscriptionPlan: "",
  currentPaymentTypePeriod: "",
  paymentType: [DefautSubscriptionDetailsPaymentType],
};

export interface initializePayment {
  subscriptionPaymentInvoiceKey: String;
  businessKey: String;
  businessUserKey: String;
  subscriptionPlan: String;
  paymentTypePeriod: String;
}
export const defaultInitializePayment: initializePayment = {
  subscriptionPaymentInvoiceKey: "",
  businessKey: "",
  businessUserKey: "",
  subscriptionPlan: "",
  paymentTypePeriod: "",
};
