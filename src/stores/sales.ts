import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import ApiService from '@/core/services/ApiService'
import JwtService from '@/core/services/JwtService'
import type { CreateSalesItem } from '@/types/sales'
interface deliveryRecord {
  saleKey: string
  saleProductKey: string
  quantityDelivered: number
  dateDelivered: string
}

interface paymentRecord {
  saleKey: string
  paymentModeKey: string
  amountPaid: 0
  datePaid: string
}

// import { SalesList } from "@/types/sales";

export const useSalesStore = defineStore('sales', () => {
  async function getHomePageSalesRecord() {
    return await ApiService.get('web-pos/pos-home-page-sales-record-list')
      .then(({ data }) => {
        return data
      })
      .catch((response) => {
        throw response
      })
  }

  async function getTodaysSalesRecord() {
    return await ApiService.get('web-pos/pos-all-todays-sale-record-list')
      .then(({ data }) => {
        return data
      })
      .catch((response) => {
        throw response
      })
  }

  async function searchSalesRecord(query: string) {
    return await ApiService.get(`web-pos/search-sale-records?saleNo=${encodeURIComponent(query)}`)
      .then(({ data }) => {
        return data
      })
      .catch((response) => {
        throw response
      })
  }
  async function getSalesProductList() {
    return await ApiService.get('web-pos/products-for-sales-activity')
      .then(({ data }) => {
        return data
      })
      .catch((response) => {
        throw response
      })
  }
  async function getSalesDetail(salesKey: string) {
    return await ApiService.get(`web-pos/sale-record-detail/${salesKey}`)
      .then(({ data }) => {
        return data
      })
      .catch((response) => {
        throw response
      })
  }
  async function getPaymentMethod() {
    return await ApiService.get('web-pos/payment-methods-for-sales-activity')
      .then(({ data }) => {
        return data
      })
      .catch((response) => {
        throw response
      })
  }
  async function recordSales(data: CreateSalesItem) {
    return await ApiService.post('web-pos/record-sale', data, {
      responseType: 'blob',
    })
      .then(({ data }) => {
        return data
      })
      .catch((response) => {
        throw response
      })
  }

  async function recordDelivery(data: deliveryRecord) {
    return await ApiService.post('web-pos/record-delivered-outstanding-sales-delivery', data)
      .then(({ data }) => {
        return data
      })
      .catch((response) => {
        throw response
      })
  }

  async function recordPayment(data: paymentRecord) {
    return await ApiService.post('web-pos/record-paid-outstanding-payment', data)
      .then(({ data }) => {
        return data
      })
      .catch((response) => {
        throw response
      })
  }
  async function generateSaleInvoice(saleKey: string) {
    return await ApiService.get(`web-pos/generate-invoice-for-print?saleKey=${saleKey}`, {
      responseType: 'blob',
    })
      .then(({ data }) => {
        return data
      })
      .catch((response) => {
        throw response
      })
  }
  async function generateSaleReceipt(saleKey: string) {
    return await ApiService.get(`web-pos/generate-receipt-for-print?saleKey=${saleKey}`)
      .then(({ data }) => {
        return data
      })
      .catch((response) => {
        throw response
      })
  }
  return {
    getHomePageSalesRecord,
    getSalesProductList,
    getPaymentMethod,
    recordSales,
    getTodaysSalesRecord,
    searchSalesRecord,
    getSalesDetail,
    recordDelivery,
    recordPayment,
    generateSaleInvoice,
    generateSaleReceipt,
  }
})
