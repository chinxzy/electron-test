export interface SalesList {
  saleKey: string;
  saleNo: string;
  itemCount: number;
  amountDue: number;
  amountPaid: number;
  outstandingAmount: number;
  isCancelled: boolean;
  isPaymentComplete: boolean;
  isDeliveryComplete: boolean;
  transactionDate: string;
  customerName: string;
}

export interface CreateSalesItem {
  transactionDate: string;
  customerKey: string;
  saleProducts: SaleProducts[];

  salePayments: [
    {
      amountPaid: number;
      paymentModeKey: string;
    },
  ];
  note: string;
}

export interface ProductSalesList {
  productKey: string;
  name: string;
  measurementUnitKey: string;
  stockQuantityBalance: number;
  price: number;
  productType: string;
  isVATable: boolean;
  measurementUnitName: string;
  productGroupName: string;
  barCode: string;
}

export interface SaleProducts {
  productKey: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  measurementUnitKey: string;
  discountAmount: number;
  discountIsPercentage: boolean;
  discountPercentage: number;
  isVATable: boolean;
  quantityDelivered: number;
}

export const defaultSalesProduct: SaleProducts = {
  productKey: "",
  productName: "",
  quantity: 0,
  unitPrice: 0,
  measurementUnitKey: "",
  discountAmount: 0,
  discountIsPercentage: false,
  discountPercentage: 0,
  isVATable: true,
  quantityDelivered: 0,
};

export const defaultSaleItem: CreateSalesItem = {
  transactionDate: "",
  customerKey: "",
  saleProducts: [],

  salePayments: [
    {
      amountPaid: 0,
      paymentModeKey: "",
    },
  ],
  note: "",
};
export interface paymentMethods {
  paymentModeKey: string;
  displayName: string;
}

export interface SaleRecordProducts {
  saleProductKey: string;
  productName: string;
  unitPrice: number;
  quantityPurchased: number;
  quantityDelivered: number;
  salePrice: number;
  isVATable: boolean;
  vat: number;
  discount: number;
  amountDue: number;
  measurementNames: {
    single: string;
    plural: string;
  };
  saleProductDeliveries: [
    {
      saleProductDeliveryKey: string;
      quantityDelivered: number;
      dateRecorded: string;
      recordedBy: string;
      isOutstandingDelivery: boolean;
      dateDelivered: string;
      isCancelled: boolean;
      cancelledBy: string;
      dateCancelled: string;
    },
  ];
}

export interface SaleRecordPayments {
  salePaymentKey: string;
  amountPaid: number;
  datePaid: string;
  paymentMethod: {
    method: string;
    bankName: string;
    accountNumber: string;
  };
  dateRecorded: string;
  recordedBy: string;
  isOutstandingPayment: boolean;
  isCancelled: boolean;
  cancelledBy: string;
  dateCancelled: string;
  saleInvoiceKey: string;
}

export interface SalesRecordInvoices {
  saleInvoiceKey: string;
  customerName: string;
  invoiceNo: string;
  status: string;
  paymentDue: number;
  invoiceDate: string;
}

export interface SalesDetail {
  saleKey: string;
  saleNo: string;
  transactionDate: string;
  totalSalePrice: number;
  totalVAT: number;
  totalAmountDue: number;
  vatApplicationType: string;
  vatRate: number;
  amountPaid: number;
  outstandingPayment: number;
  saleProducts: SaleRecordProducts[];
  salePayments: SaleRecordPayments[];
  customerInfo: {
    name: string;
    phoneNumber: string;
  };
  documentType: string;
  note: string;
  isCancelled: boolean;
  dateRecorded: string;
  recordedBy: string;
  saleInvoices: SalesRecordInvoices[];
}

export const DefaultSalesDetail: SalesDetail = {
  saleKey: "",
  saleNo: "",
  transactionDate: "",
  totalSalePrice: 0,
  totalVAT: 0,
  totalAmountDue: 0,
  vatApplicationType: "",
  vatRate: 0,
  amountPaid: 0,
  outstandingPayment: 0,
  saleProducts: [],
  salePayments: [],
  customerInfo: {
    name: "",
    phoneNumber: "",
  },
  documentType: "",
  note: "",
  isCancelled: false,
  dateRecorded: "",
  recordedBy: "",
  saleInvoices: [],
};
