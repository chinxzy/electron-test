export interface CustomerList {
  customerKey: string;
  customerName: string;
  phoneNumber: string;
  email: string;
  note: string;
  lastPurchaseAmount: number;
  totalDebt: number;
}
export interface CustomerDebt {
  saleKey: string;
  saleNo: string;
  itemCount: number;
  totalAmountDue: number;
  outstandingAmount: number;
  outstandingDelivery: boolean;
}
export interface CreateCustomer {
  name: string;
  phoneNumber: string;
  email: string;
  note: string;
}

export const DefaultCreateCustomer: CreateCustomer = {
  name: "",
  phoneNumber: "",
  email: "",
  note: "",
};
