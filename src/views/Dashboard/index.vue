<template>
  <div class="p-6 max-w-lg mx-auto bg-gray-100 rounded-xl shadow-md space-y-4">
    <h2 class="text-2xl font-bold text-center text-gray-800">Silent HTML Printing</h2>

    <!-- Removed printer selection dropdown -->
    <!-- <div class="space-y-2">
      <label for="printer-select" class="block text-sm font-medium text-gray-700">Select Printer:</label>
      <select
        id="printer-select"
        v-model="selectedPrinterName"
        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option v-if="printers.length === 0 && !loadingPrinters" value="">No printers found or loading...</option>
        <option v-for="printer in printers" :key="printer.name" :value="printer.name">
          {{ printer.displayName }} {{ printer.isDefault ? '(Default)' : '' }}
        </option>
      </select>
      <p v-if="printers.length === 0 && !loadingPrinters" class="text-sm text-red-600">No printers found or error loading.</p>
    </div> -->

    <button
      @click="printSampleHtml"
      :disabled="printing"
      class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {{ printing ? 'Printing...' : 'Print Sample HTML Silently' }}
    </button>

    <div
      v-if="printStatusMessage"
      :class="[
        'p-3 rounded-md text-sm',
        printStatusSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
      ]"
    >
      {{ printStatusMessage }}
    </div>

    <p class="text-xs text-gray-500 text-center mt-4">
      This will attempt to print generated HTML directly to the **default** printer.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'

// Declare the global Electron API exposed by the preload script
// This is crucial for TypeScript to recognize window.electronAPI
declare global {
  interface Window {
    electronAPI: {
      // silentPrintHtml no longer takes printerName as it will use default
      silentPrintHtml: (
        htmlContentUint8Array: Uint8Array,
      ) => Promise<{ success: boolean; message?: string }>
      // Removed getPrinters as it's no longer needed
      // getPrinters: () => Promise<Array<{ name: string; displayName: string; description: string; isDefault: boolean }>>;
      onPrintStatus: (
        callback: (status: { success: boolean; message?: string }) => void,
      ) => () => void
    }
  }
}

export default defineComponent({
  name: 'PrintComponent',
  setup() {
    // Removed printer-related refs
    // const printers = ref<Array<{ name: string; displayName: string; description: string; isDefault: boolean }>>([]);
    // const selectedPrinterName = ref<string>('');
    // const loadingPrinters = ref<boolean>(false);

    const printing = ref<boolean>(false)
    const printStatusMessage = ref<string>('')
    const printStatusSuccess = ref<boolean>(false)

    let unsubscribePrintStatus: (() => void) | null = null // To store the unsubscribe function for the IPC listener

    // Removed fetchPrinters function as it's no longer needed
    // const fetchPrinters = async () => {
    //   if (window.electronAPI && typeof window.electronAPI.getPrinters === 'function') {
    //     loadingPrinters.value = true;
    //     try {
    //       const availablePrinters = await window.electronAPI.getPrinters();
    //       printers.value = availablePrinters;
    //       const defaultPrinter = availablePrinters.find(p => p.isDefault);
    //       if (defaultPrinter) {
    //         selectedPrinterName.value = defaultPrinter.name;
    //       } else if (availablePrinters.length > 0) {
    //         selectedPrinterName.value = availablePrinters[0].name;
    //       }
    //     } catch (error) {
    //       console.error('Failed to fetch printers:', error);
    //       printStatusMessage.value = 'Failed to load printers.';
    //       printStatusSuccess.value = false;
    //     } finally {
    //       loadingPrinters.value = false;
    //     }
    //   } else {
    //     console.warn('Electron API (getPrinters) not available in renderer.');
    //     printStatusMessage.value = 'Electron printing API not available. Ensure preload script is loaded correctly.';
    //     printStatusSuccess.value = false;
    //   }
    // };

    // Function to simulate generating HTML content as Uint8Array
    const data: any = {
      documentNo: 'SR-25-30',
      documentDate: '2025-07-09',
      businessName: 'LintInt Tech',
      businessStreet: '4C Romanus Orji, Southern View Estate',
      businessTown: 'Lekki',
      businessState: 'Lagos',
      businessPhone: '08129092585',
      businessEmail: 'henry.dotstacknet@gmail.com',
      customerName: 'Uchenna Okere',
      customerPhone: '08135842383',
      saleProducts: [
        {
          productName: 'children schoolbags',
          quantity: 2.0,
          measurementUnitName: 'Pieces',
          vat: 0.0,
          unitPrice: 4000.0,
          salePrice: 8000.0,
        },
        {
          productName: 'Female Adult Braid',
          quantity: 2.0,
          measurementUnitName: 'Persons',
          vat: 0.0,
          unitPrice: 650000.0,
          salePrice: 1300000.0,
        },
        {
          productName: 'Electrical works',
          quantity: 1.0,
          measurementUnitName: 'Unit',
          vat: 525.0,
          unitPrice: 10000.0,
          salePrice: 7000.0,
        },
        {
          productName: 'Nokia C12',
          quantity: 3.0,
          measurementUnitName: 'Persons',
          vat: 0.0,
          unitPrice: 150000.0,
          salePrice: 450000.0,
        },
      ],
      totalAmountPaid: 1765525.0,
      totalVAT: 525.0,
      totalSalePrice: 1765000.0,
      functionalCurrencySymbol: '₦',
      vatRate: 7.5,
    }

    const generateSampleHtmlContent = (): Uint8Array => {
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
         <div style="text-align: center; margin-top: 10px;">Thank you!</div>
            
            
         
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
                         <span><b>${data.functionalCurrencySymbol}${item.vat}</b></span>`
                             : ''
                         }
               
                        </div>
                        <div>
                        <p style="margin-bottom:4px">Unit Price</p>
                        <span><b>${data.functionalCurrencySymbol}${item.unitPrice} </b></span>
                         <p style="margin-bottom:4px">Sales Price</p>
                         <span><b>${data.functionalCurrencySymbol}${item.salePrice}</b></span>
               
                        </div>
                  
                 
                  
                </div>
                <hr  style=" margin-bottom:8px"/>
              `,
            )
            .join('')}
          
         <div style=" margin: 0 auto;">

    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e7eb; padding: 0.75rem 0; font-size: 13px;">
      <span>Total Sales Price</span>
      <span>${data.functionalCurrencySymbol}${data.totalSalePrice}</span>
    </div>
${
  data.totalVAT > 0
    ? ` <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e7eb; padding: 0.75rem 0; font-size: 13px;">
      <span>Total VAT</span>
      <span>${data.functionalCurrencySymbol}${data.totalVAT}</span>
    </div>`
    : ''
}
   

    

    <div style="display: flex; justify-content: space-between; align-items: center; font-weight: bold; background-color: #f3f4f6; margin-top: 0.5rem; font-size: 14px;">
      <span>Total Amount Paid</span>
      <span>${data.functionalCurrencySymbol}${data.totalAmountPaid}</span>
    </div>

    <div style="text-align: center; font-size: 14px; color: #64748b; margin-top: 1rem; display:flex; align-items:center; justify-content:center">
      <span style="margin-right:4px">Powered by</span>
      <img src="https://oditorapp-web-assets.azureedge.net/email-template-assets/logo.png" style="width:4em" />
    </div>

      </body>
    </html>
  `

      const encoder = new TextEncoder()
      return encoder.encode(htmlContent)
    }

    // Function to trigger silent printing via the main process
    const printSampleHtml = async () => {
      // Removed printerName check as it's no longer selected
      // if (!selectedPrinterName.value) {
      //   printStatusMessage.value = 'Please select a printer.';
      //   printStatusSuccess.value = false;
      //   return;
      // }

      if (window.electronAPI && typeof window.electronAPI.silentPrintHtml === 'function') {
        printing.value = true
        printStatusMessage.value = 'Sending print request...'
        printStatusSuccess.value = true // Assume success initially for the request sending

        const htmlData = generateSampleHtmlContent() // Get your HTML content as Uint8Array

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
    }

    // Lifecycle hooks
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

    return {
      // Removed printer-related refs from return
      // printers,
      // selectedPrinterName,
      // loadingPrinters,
      printing,
      printStatusMessage,
      printStatusSuccess,
      printSampleHtml,
    }
  },
})
</script>

<style scoped>
/* Basic Tailwind-like styles for demonstration */
.p-6 {
  padding: 1.5rem;
}
.max-w-lg {
  max-width: 32rem;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.bg-gray-100 {
  background-color: #f3f4f6;
}
.rounded-xl {
  border-radius: 0.75rem;
}
.shadow-md {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
.space-y-4 > *:not(:first-child) {
  margin-top: 1rem;
}
.text-2xl {
  font-size: 1.5rem;
}
.font-bold {
  font-weight: 700;
}
.text-center {
  text-align: center;
}
.text-gray-800 {
  color: #1f2937;
}
.space-y-2 > *:not(:first-child) {
  margin-top: 0.5rem;
}
.block {
  display: block;
}
.text-sm {
  font-size: 0.875rem;
}
.font-medium {
  font-weight: 500;
}
.text-gray-700 {
  color: #374151;
}
.mt-1 {
  margin-top: 0.25rem;
}
.w-full {
  width: 100%;
}
.pl-3 {
  padding-left: 0.75rem;
}
.pr-10 {
  padding-right: 2.5rem;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.text-base {
  font-size: 1rem;
}
.border-gray-300 {
  border-color: #d1d5db;
}
.focus\:outline-none:focus {
  outline: 0;
}
.focus\:ring-indigo-500:focus {
  --tw-ring-color: #6366f1;
  ring-color: var(--tw-ring-color);
}
.focus\:border-indigo-500:focus {
  border-color: #6366f1;
}
.sm\:text-sm {
  font-size: 0.875rem;
}
.rounded-md {
  border-radius: 0.375rem;
}
.text-red-600 {
  color: #dc2626;
}

.bg-blue-600 {
  background-color: #2563eb;
}
.hover\:bg-blue-700:hover {
  background-color: #1d4ed8;
}
.text-white {
  color: #fff;
}
.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.rounded-lg {
  border-radius: 0.5rem;
}
.shadow-md {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
.transition {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.duration-300 {
  transition-duration: 300ms;
}
.ease-in-out {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
.transform {
  transform: var(--tw-transform);
}
.hover\:scale-105:hover {
  --tw-scale-x: 1.05;
  --tw-scale-y: 1.05;
  transform: var(--tw-transform);
}
.disabled\:opacity-50:disabled {
  opacity: 0.5;
}
.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}

.bg-green-100 {
  background-color: #d1fae5;
}
.text-green-800 {
  color: #065f46;
}
.bg-red-100 {
  background-color: #fee2e2;
}
.text-red-800 {
  color: #991b1b;
}
.mt-4 {
  margin-top: 1rem;
}
</style>
