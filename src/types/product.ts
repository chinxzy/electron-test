export interface createProduct {
  name: string;
  measurementUnitKey: string;
  unitPrice: number;
  initialQuantity: number;
  reorderLevel: number;
  notifyAboutReorderLevel: boolean;
  description: string;
  isVATable: boolean;
  productGroupKey: string;
  vatType: string;
  barCode: string;
}
export interface createProductService {
  name: string;
  measurementUnitKey: string;
  unitPrice: number;
  description: string;
  productGroupKey: string;
  isVATable: boolean;
  vatType: string;
}

export interface createProductWithoutInventory {
  name: string;
  measurementUnitKey: string;
  unitPrice: number;
  isVATable: boolean;
  description: string;
  productGroupKey: string;
  barCode: string;
  vatType: string;
}

export const DefaultCreateProduct: createProduct = {
  name: "",
  measurementUnitKey: "",
  unitPrice: 0,
  initialQuantity: 0,
  reorderLevel: 0,
  notifyAboutReorderLevel: false,
  description: "",
  isVATable: false,
  productGroupKey: "",
  vatType: "",
  barCode: "",
};
export const DefaultCreateProductService: createProductService = {
  name: "",
  measurementUnitKey: "",
  unitPrice: 0,
  description: "",
  productGroupKey: "",
  isVATable: false,
  vatType: "",
};
export const DefaultCreateProductWithoutInventory: createProductWithoutInventory =
  {
    name: "",
    measurementUnitKey: "",
    unitPrice: 0,
    isVATable: false,
    description: "",
    productGroupKey: "",
    barCode: "",
    vatType: "",
  };
export interface createProductGroup {
  productGroupName: string;
  parentProductGroupKey: string;
  parentProductGroupName: string;
}

export const DefaultCreateProductGroup: createProductGroup = {
  productGroupName: "",
  parentProductGroupKey: "",
  parentProductGroupName: "",
};
export interface ProductList {
  productKey: string;
  productType: string;
  name: string;
  quantity: number;
  unitPrice: number;
  measurementUnitName: string;
  stockLevelStatus: string;
  attentionNote: string;
  hasIncomingStock: boolean;
}

export interface ProductGroupList {
  productGroupItemCount: number;
  productGroupKey: string;
  productGroupName: string;
}

export interface activityLog {
  activityDate: string;
  logMessage: string;
  activityQuantity: number;
  quantityBeforeActivity: number;
  quantityAfterActivity: number;
}

export interface ProductDetails {
  productKey: string;
  name: string;
  description: string;
  quantityBalance: number;
  reorderLevel: number;
  notifyAboutReorderLevel: true;
  measurementNames: {
    single: string;
    plural: string;
  };
  measurementUnitKey: string;
  unitPrice: number;
  collectVAT: true;
  hasTransaction: true;
  barCode: string;
  activityLogs: activityLog[];
}
export interface MeasurementUnit {
  measurementUnitKey: string;
  name: string;
}

export interface getLastRestockInfo {
  restockHistoryKey: string;
  quantity: 0;
  measurementName: string;
  dateRestocked: string;
  restockedBy: string;
}
