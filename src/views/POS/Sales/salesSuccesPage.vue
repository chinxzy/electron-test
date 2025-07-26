<template>
  <MasterLayout>
    <!-- <template #breadcrumb>
      <Breadcrumb :breadcrumbs="[{ label: 'Product', path: '/product' }]" />
    </template> -->
    <div class="flex justify-center w-full p-4">
      <div class="text-center w-full">
        <img
          src="../../../assets/icons/succes.svg"
          alt=""
          class="mx-auto w-[138px]"
        />
        <p class="text-primary font-medium text-[20px] mt-6 mb-4">Successful</p>
        <p class="text-lessEmphasis mb-6">
          Sales Record submitted successfully
        </p>
        <div
          class="flex justify-center items-center gap-x-[200px] text-primary font-medium text-[18px]"
        >
          <div class="cursor-pointer" @click="print">
            <img src="/images/print.svg" alt="" />
            <p>Print Receipt</p>
          </div>
          <router-link to="/record-sales">
            <div class="cursor-pointer">
              <img src="/images/files.svg" alt="" />
              <p>Record Another Sale</p>
            </div>
          </router-link>
        </div>
        <router-link to="/pos"
          ><ButtonComp type="primary" class="w-fit h-12 px-20 mt-20">
            Return to Home
          </ButtonComp></router-link
        >
      </div>
    </div>
  </MasterLayout>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import MasterLayout from "@/components/layout/MasterLayout.vue";
// function print() {
//   const base64 = localStorage.getItem("sales-receipt");
//   if (!base64) {
//     console.error("No receipt found in localStorage");
//     return;
//   }

//   const newWindow = window.open();
//   if (newWindow) {
//     newWindow.document.write(`
//       <html>
//         <head><title>Sales Receipt</title></head>
//         <body style="margin:0">
//           <embed width="100%" height="100%" type="application/pdf" src="${base64}"/>
//         </body>
//       </html>
//     `);

//     newWindow.document.close();
//   } else {
//     alert("Popup blocked. Please allow popups for this site.");
//   }
//   //   const link = document.createElement('a');
//   //   link.href = base64; // Already in data:application/pdf;base64,...
//   //   link.download = 'sales-receipt.pdf';
//   //   document.body.appendChild(link);
//   //   link.click();
//   //   document.body.removeChild(link);

//   // Optional: Clean up
// }
function base64ToBlob(base64Data: string, mimeType = "application/pdf"): Blob {
  // If it's a data URL, extract only the base64 part
  const base64 = base64Data.includes(",")
    ? base64Data.split(",")[1]
    : base64Data;

  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let i = 0; i < byteCharacters.length; i += 512) {
    const slice = byteCharacters.slice(i, i + 512);
    const byteNumbers = new Array(slice.length);

    for (let j = 0; j < slice.length; j++) {
      byteNumbers[j] = slice.charCodeAt(j);
    }

    byteArrays.push(new Uint8Array(byteNumbers));
  }

  return new Blob(byteArrays, { type: mimeType });
}

function print() {
  const base64 = localStorage.getItem("sales-receipt");
  if (!base64) {
    console.error("No receipt found in localStorage");
    return;
  }
  const blob = base64ToBlob(base64);
  const blobUrl = URL.createObjectURL(blob);

  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = blobUrl;

  iframe.onload = () => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
  };

  document.body.appendChild(iframe);
}
</script>
