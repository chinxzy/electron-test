import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import ApiService from '@/core/services/ApiService'
import JwtService from '@/core/services/JwtService'
import type { createProduct, createProductGroup } from '@/types/product'

// import { SalesList } from "@/types/sales";

export const usePoductStore = defineStore('product', () => {
  async function getProductList() {
    return await ApiService.get('web-pos/product-list')
      .then(({ data }) => {
        return data
      })
      .catch((response) => {
        throw response
      })
  }
  async function getProductListByGroup(itemKey: string) {
    return await ApiService.get(`web-pos/product-list-by-product-group/${itemKey}`)
      .then(({ data }) => {
        return data
      })
      .catch((response) => {
        throw response
      })
  }
  async function getProductDetails(itemKey: string, itemName: string, type: string) {
    const withInventory = 'web-pos/product-goods-detail'
    const withoutInventory = 'web-pos/product-goods-without-inventory-detail'
    const service = 'web-pos/product-service-detail'
    return await ApiService.get(
      `${
        type == 'goods' ? withInventory : type == 'service' ? service : withoutInventory
      }?${type == 'service' ? 'productServiceKey' : 'goodsItemKey'}=${itemKey}&${type == 'service' ? 'productServiceName' : 'goodsItemName'}=${itemName}`,
    )
      .then(({ data }) => {
        return data
      })
      .catch((response) => {
        throw response
      })
  }

  async function getLastRestockInfo(itemKey: string) {
    return await ApiService.get(`web-pos/last-restocked-info/${itemKey}`)
      .then(({ data }) => {
        return data
      })
      .catch((response) => {
        throw response
      })
  }

  async function getMeasurementUnits() {
    return await ApiService.get(`web-pos/get-measurement-units`)
      .then(({ data }) => {
        return data
      })
      .catch((response) => {
        throw response
      })
  }

  async function createGroup(data: createProductGroup) {
    return await ApiService.post('web-pos/create-product-group', data)
      .then(({ data }) => {
        return data
      })
      .catch((response) => {
        throw response
      })
  }
  async function createProducts(data: any, type: string) {
    console.log('type', type)
    const withInventory = 'web-pos/create-goods-item'
    const withoutInventory = 'web-pos/create-goods-without-inventory'
    const service = 'web-pos/create-product-service'

    return await ApiService.post(
      type == 'goods' ? withInventory : type == 'service' ? service : withoutInventory,
      data,
    )
      .then(({ data }) => {
        return data
      })
      .catch((response) => {
        throw response
      })
  }
  async function getVatRate() {
    return await ApiService.get(`web-pos/vat-rate`)
      .then(({ data }) => {
        return data
      })
      .catch((response) => {
        throw response
      })
  }

  return {
    getProductList,
    createGroup,
    createProducts,
    getProductDetails,
    getMeasurementUnits,
    getProductListByGroup,
    getLastRestockInfo,
    getVatRate,
  }
})
