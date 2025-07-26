import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import ApiService from '@/core/services/ApiService'
import JwtService from '@/core/services/JwtService'
import { get } from 'lodash'

// import { SalesList } from "@/types/sales";

export const useCustomerStore = defineStore('customer', () => {
  async function getCustomerList() {
    return await ApiService.get('web-pos/customer-list')
      .then(({ data }) => {
        return data
      })
      .catch((response) => {
        throw response
      })
  }

  async function getCustomerDebt(customerKey: string) {
    return await ApiService.get(`web-pos/customer-outstanding-debts/${customerKey}`)
      .then(({ data }) => {
        return data
      })
      .catch((response) => {
        throw response
      })
  }

  async function createCustomer(data: any) {
    console.log('data', data)
    return await ApiService.post('web-pos/create-customer', data)
      .then(({ data }) => {
        return data
      })
      .catch((response) => {
        throw response
      })
  }
  return {
    getCustomerList,
    createCustomer,
    getCustomerDebt,
  }
})
