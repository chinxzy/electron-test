<template>
  <MasterLayout>
    <template #breadcrumb>
      <Breadcrumb :breadcrumbs="[{ label: 'Sales Detail', path: 'sales-record-detail' }]" />
    </template>
    <LoadingComponent v-if="loading" />
    <section v-else>
      <div class="flex items-center gap-x-2 mb-14 w-fit cursor-pointer" @click="$router.back()">
        <img src="/images/chevron-left.svg" alt="" />
        <p class="mb-0 text-textGray text-sm">Home / Sale Detail</p>
      </div>

      <div class="p-6">
        <div class="font-medium text-[18px]">Products item</div>
        <DataTable :value="saleDetail.saleProducts">
          <Column field="" header="" class="p-6">
            <template #body="data">
              <section class="py-3">
                <p
                  class="text-2xl font-medium text-[#000] leading-[145%] cursor-pointer"
                  @click="openDetailModal(data.data)"
                >
                  {{ data.data.productName }}
                </p>
                <div class="flex justify-between">
                  <div class="flex gap-x-4 text-lessEmphasis mt-2">
                    <p>
                      Quantity: {{ data.data.quantityPurchased }}
                      {{
                        data.data.quantityPurchased > 1
                          ? data.data.measurementNames.plural
                          : data.data.measurementNames.single
                      }}
                    </p>
                    <span>|</span>
                    <p>SalesPrice: {{ formatNumber(data.data.salePrice, 2) }}</p>
                    <div v-if="data.data.isVATable" class="flex gap-x-4">
                      <span>|</span>
                      <p>VAT: {{ formatNumber(data.data.vat, 2) }}</p>
                      <span>|</span>
                      <p>Amount Due: {{ formatNumber(data.data.amountDue, 2) }}</p>
                    </div>
                  </div>
                  <img
                    src="/images/arrow-right.svg"
                    alt=""
                    @click="openDeliveryHistory(data.data)"
                    class="cursor-pointer"
                  />
                </div>

                <div
                  class="text-error-500 mt-4"
                  v-if="data.data.quantityPurchased > data.data.quantityDelivered"
                >
                  <p>
                    {{ data.data.quantityPurchased - data.data.quantityDelivered }}
                    {{
                      data.data.quantityPurchased - data.data.quantityDelivered > 1
                        ? data.data.measurementNames.plural
                        : data.data.measurementNames.single
                    }}
                    awaiting delivery
                  </p>
                </div>
              </section>
            </template>
          </Column>
        </DataTable>
      </div>
      <div class="mt-12 grid grid-cols-2 w-full gap-x-12">
        <div class="w-full">
          <div class="p-6 border border-[#DCE3E780] rounded-xl w-full">
            <p class="font-semibold text-lightgray">Customer Details</p>
            <div class="mt-6">
              <p>Name</p>
              <div class="border border-[#dce3e7] p-4 mt-2 rounded-lg">
                {{ saleDetail.customerInfo.name || 'N/A' }}
              </div>
            </div>
            <div class="mt-4">
              <p>Phone Number</p>
              <div class="border border-[#dce3e7] p-4 mt-2 rounded-lg">
                {{ saleDetail.customerInfo.phoneNumber || 'N/A' }}
              </div>
            </div>
          </div>
        </div>
        <div
          class="bg-[#FAFAFA] p-6 flex flex-col gap-y-6 font-medium text-2xl rounded-xl text-gray"
        >
          <div class="flex justify-between gap-x-3">
            <p class="mb-0">Total Amount</p>
            <div class="flex gap-x-10">
              <p class="mb-0 text-right">
                {{ formatNumber(totalSalesPrice, 2) }}
              </p>
              <p></p>
            </div>
          </div>

          <div class="flex justify-between gap-x-3">
            <p class="mb-0">VAT (7.5%)</p>
            <div class="flex gap-x-10">
              <p class="mb-0 text-right">{{ formatNumber(totalVat, 2) }}</p>
              <p></p>
            </div>
          </div>
          <div class="flex justify-between gap-x-3">
            <p class="mb-0 font-bold">Total Amount Due</p>
            <div class="flex gap-x-10">
              <p class="mb-0 font-bold text-right">
                {{ formatNumber(totalAmount, 2) }}
              </p>
              <p></p>
            </div>
          </div>
          <div class="flex justify-between gap-x-3">
            <p class="mb-0">Amount Paid</p>
            <div class="flex gap-x-4">
              <p class="mb-0 text-right">
                {{ formatNumber(saleDetail.amountPaid, 2) }}
              </p>
              <img
                src="/images/arrow-right.svg"
                alt=""
                @click="paymentModal = true"
                class="cursor-pointer"
              />
            </div>
          </div>
          <div class="flex justify-between gap-x-3">
            <p class="mb-0">Outstanding</p>
            <div class="flex gap-x-4">
              <p class="mb-0 text-error-500 text-right">
                {{ formatNumber(saleDetail.outstandingPayment, 2) }}
              </p>
              <img
                src="/images/arrow-right.svg"
                alt=""
                @click="paymentModal = true"
                class="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="mt-9 grid grid-cols-2 w-full gap-x-12">
        <div class="w-full">
          <div class="p-6 border border-[#DCE3E780] rounded-xl w-full">
            <p class="font-semibold text-lightgray">Recorded By</p>
            <div class="mt-6">
              <p>Name</p>
              <div class="border border-[#dce3e7] p-4 mt-2 rounded-lg">
                {{ saleDetail.recordedBy || 'N/A' }}
              </div>
            </div>
            <div class="mt-4">
              <p>Date & Time Recorded</p>
              <div class="border border-[#dce3e7] p-4 mt-2 rounded-lg">
                {{ formatDateTime(saleDetail.dateRecorded) || 'N/A' }}
              </div>
            </div>
          </div>
        </div>
        <div class="w-full">
          <div class="p-6 border border-[#DCE3E780] rounded-xl w-full">
            <div class="flex mb-3 items-center justify-between">
              <p class="text-[#666666] font-semibold">Note</p>
            </div>
            {{ saleDetail.note }}
          </div>
        </div>
      </div>
      <div
        v-if="!generateLoading"
        class="cursor-pointer mt-20 mx-auto flex justify-center text-center"
        @click="print"
      >
        <div class="flex flex-col items-center text-primary font-medium text-2xl">
          <img src="/images/receipt-item.svg" alt="" />
          <p>Click here to</p>
          <p v-if="saleDetail.outstandingPayment > 0">print invoice</p>
          <p v-else>print receipt</p>
        </div>
      </div>
      <div
        v-if="generateLoading"
        class="cursor-pointer mt-20 mx-auto flex justify-center text-center"
      >
        <div class="flex flex-col items-center text-primary font-medium text-2xl">
          <img src="/images/receipt-item.svg" alt="" />
          <p>Generating...</p>
        </div>
      </div>
      <SaleProductDetail
        :detail-modal-open="detailModal"
        :products="selectedProduct"
        @detail-modal-close="detailModal = false"
      />
      <DeliveryHistory
        :delivery-history="selectedHistory"
        :delivery-modal-open="deliveryModal"
        @delivery-modal-close="deliveryModal = false"
        @reload="getSalesDetail"
      />
      <PaymentHistory
        :payment-history="saleDetail"
        :payment-modal-open="paymentModal"
        @payment-modal-close="paymentModal = false"
        @reload="getSalesDetail"
      />
    </section>
  </MasterLayout>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import MasterLayout from '@/components/layout/MasterLayout.vue'
import { useRoute } from 'vue-router'
import { formatNumber } from '@/core/helpers/utility'
declare global {
  interface Window {
    electronAPI: {
      silentPrintHtml: (
        htmlContentUint8Array: Uint8Array,
      ) => Promise<{ success: boolean; message?: string }>
      onPrintStatus: (
        callback: (status: { success: boolean; message?: string }) => void,
      ) => () => void
    }
  }
}
// const { ipcRenderer } = window.require("electron");
// const { Buffer } = window.require("buffer");
import { useSalesStore } from '@/stores/sales'
import type { SalesDetail, SaleRecordProducts } from '@/types/sales'
import { DefaultSalesDetail } from '@/types/sales'
import { formatDateTime } from '@/core/helpers/utility'
import LoadingComponent from '@/components/ui/loadingComponent.vue'
import SaleProductDetail from '../Modals/saleProductDetail.vue'
import DeliveryHistory from '../Modals/deliveryHistory.vue'
import PaymentHistory from '../Modals/paymentHistory.vue'
const route = useRoute()
const detailModal = ref<boolean>(false)
const deliveryModal = ref<boolean>(false)
const paymentModal = ref<boolean>(false)

const generateLoading = ref<boolean>(false)
const store = useSalesStore()
const saleDetail = ref<SalesDetail>({ ...DefaultSalesDetail })
const loading = ref<boolean>(false)
const salesKey = String(route.params.id)
const selectedProduct = ref<any>({})
const selectedHistory = ref<any>({})

const totalSalesPrice = computed<number>(() => {
  return saleDetail.value.saleProducts.reduce((sum: any, item: any) => sum + item.salePrice, 0)
})
const totalVat = computed<number>(() => {
  return saleDetail.value.saleProducts.reduce((sum: any, item: any) => sum + item.vat, 0)
})
const totalAmount = computed<number>(() => {
  return totalSalesPrice.value + totalVat.value
})
const printing = ref<boolean>(false)
const printStatusMessage = ref<string>('')
const printStatusSuccess = ref<boolean>(false)

let unsubscribePrintStatus: (() => void) | null = null // To store the unsubscribe function for the IPC listener
const generateSampleHtmlContent = (data: any): Uint8Array => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <body
    style="
      width: 250px;
      font-size: 13px;
      font-family: "Outfit", sans-serif;
 
      padding-top: 8px;
      padding-bottom: 33px;
      color: #001928;
    "
  > 
       <div style="text-align: center; font-weight: bold; color:#374B58; margin-bottom:8px">${data.businessName}</div>
          <div style="text-align: center;font-weight: 300; color:#374B58; margin-bottom:8px">${data.businessStreet}, ${data.businessTown}, ${data.businessState}</div>
          
          <div style="text-align: center;font-weight: 300; color:#374B58; margin-bottom:8px">Tel: ${data.businessPhone}</div>
           <div style="text-align: center;font-weight: 300; color:#374B58; margin-bottom:12px">Email: ${data.businessEmail}</div>
          <hr style=""/>
          <div style="display:flex; justify-content:space-between"> <div><p>Bill to:<p/>
            <p><b>${data.customerName}</b></p>
                ${data.customerPhone ? `<p><b>${data.customerPhone}</b></p>` : ''}
                ${data.customerEmail ? `<p><b>${data.customerEmail}</b></p>` : ''}</div><div style="text-align: right"><p><span>Receipt No: </span><span><b>${data.documentNo}</b></span></p>
                <span>Date: </span><span><b>${data.documentDate}</b></span></div></div>
         
            
            
         
          <hr style=" margin-bottom:8px"/>
          ${data.saleProducts
            .map(
              (item: any) => `
                <div style="margin-bottom:1px; font-weight:600; font-size:15px">${item.productName}</div>
                <div style="display: flex; justify-content: space-between; margin-bottom:8px">
                    <div>
                        <p style="margin-bottom:4px">Quantity</p>
                        <span><b>${item.quantity} ${item.measurementUnitName}</b></span>
                         ${
                           item.vat > 0
                             ? `<p style="margin-bottom:4px">VAT (${data.vatRate}%)</p>
                         <span><b>${formatNumber(item.vat, 2)}</b></span>`
                             : ''
                         }
               
                        </div>
                        <div>
                        <p style="margin-bottom:4px">Unit Price</p>
                        <span><b>${formatNumber(item.unitPrice, 2)} </b></span>
                         <p style="margin-bottom:4px">Sales Price</p>
                         <span><b>${formatNumber(item.salePrice, 2)}</b></span>
               
                        </div>
                  
                 
                  
                </div>
                <hr  style=" margin-bottom:8px"/>
              `,
            )
            .join('')}
          
         <div style=" margin: 0 auto;">

    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e7eb; padding: 0.75rem 0; font-size: 13px;">
      <span>Total Sales Price</span>
      <span>${formatNumber(data.totalSalePrice, 2)}</span>
    </div>
${
  data.totalVAT > 0
    ? ` <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e7eb; padding: 0.75rem 0; font-size: 13px;">
      <span>Total VAT</span>
      <span>${formatNumber(data.totalVAT, 2)}</span>
    </div>`
    : ''
}
   

    

    <div style="display: flex; justify-content: space-between; align-items: center; font-weight: bold; background-color: #f3f4f6; margin-top: 0.5rem; font-size: 14px;">
      <span>Total Amount Paid</span>
      <span>${formatNumber(data.totalAmountPaid, 2)}</span>
    </div>

    <div style="text-align: center; font-size: 14px;  margin-top: 1rem; margin-bottom:3em; display:flex; align-items:center; justify-content:center">
      <span style="margin-right:4px">Powered by</span>
      <img src="https://oditorapp-web-assets.azureedge.net/email-template-assets/logo.png" style="width:4em" />
    </div>
    
    </div>

      </body>
    </html>
  `

  const encoder = new TextEncoder()
  return encoder.encode(htmlContent)
}
function openDetailModal(product: any) {
  selectedProduct.value = product
  detailModal.value = true
}
function openDeliveryHistory(history: any) {
  deliveryModal.value = true
  selectedHistory.value = history
}
async function getSalesDetail() {
  loading.value = true
  await store
    .getSalesDetail(salesKey)
    .then((response: any) => {
      saleDetail.value = response
    })
    .finally(() => {
      loading.value = false
    })
}
function print() {
  if (saleDetail.value.outstandingPayment > 0) {
    generateInvoice()
  } else {
    generateReceipt()
  }
}
async function generateInvoice() {
  generateLoading.value = true
  await store
    .generateSaleInvoice(salesKey)
    .then((response: any) => {
      const blobUrl = URL.createObjectURL(response)

      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.src = blobUrl

      iframe.onload = () => {
        iframe.contentWindow?.focus()
        iframe.contentWindow?.print()
      }

      document.body.appendChild(iframe)
    })
    .finally(() => {
      generateLoading.value = false
    })
}

async function generateReceipt() {
  generateLoading.value = true

  await store
    .generateSaleReceipt(salesKey)
    .then(async (response: any) => {
      if (window.electronAPI && typeof window.electronAPI.silentPrintHtml === 'function') {
        printing.value = true
        printStatusMessage.value = 'Sending print request...'
        printStatusSuccess.value = true // Assume success initially for the request sending

        const htmlData = generateSampleHtmlContent(response) // Get your HTML content as Uint8Array

        try {
          // Call silentPrintHtml without printerName
          const response = await window.electronAPI.silentPrintHtml(htmlData)
          if (!response || typeof response.success !== 'boolean') {
            printStatusMessage.value = `Unexpected response from main process.`
            printStatusSuccess.value = false
            printing.value = false
            return
          }
          // The response here indicates if the request was successfully sent to main process.
          // The actual print success/failure will come via the 'onPrintStatus' listener.
          if (!response.success) {
            printStatusMessage.value = `Failed to send print request to main process: ${response.message}`
            printStatusSuccess.value = false
            printing.value = false // Reset printing state if initial request failed
          }
        } catch (error) {
          console.error('Error invoking silentPrintHtml:', error)
          printStatusMessage.value = `Error initiating print: ${error instanceof Error ? error.message : String(error)}`
          printStatusSuccess.value = false
          printing.value = false
        }
      } else {
        printStatusMessage.value = 'Electron API (silentPrintHtml) not available in renderer.'
        printStatusSuccess.value = false
      }
    })
    .finally(() => {
      generateLoading.value = false
    })
}
onMounted(() => {
  console.log('Renderer process: PrintComponent mounted.')
  console.log('Renderer process: Checking window.electronAPI:', window.electronAPI)

  // Removed call to fetchPrinters as it's no longer needed
  // fetchPrinters();

  // Subscribe to print status updates from the main process
  if (window.electronAPI && typeof window.electronAPI.onPrintStatus === 'function') {
    unsubscribePrintStatus = window.electronAPI.onPrintStatus((status) => {
      printStatusMessage.value =
        status.message || (status.success ? 'Print completed successfully.' : 'Print failed.')
      printStatusSuccess.value = status.success
      printing.value = false // Reset printing state when final status is received
      console.log('Print status received from main process:', status)
    })
  } else {
    console.warn('Electron API (onPrintStatus) not available for subscription.')
  }
})

onUnmounted(() => {
  // Clean up the IPC listener when the component is unmounted to prevent memory leaks
  if (unsubscribePrintStatus) {
    unsubscribePrintStatus()
    console.log('Print status listener unsubscribed.')
  }
})
getSalesDetail()
</script>
