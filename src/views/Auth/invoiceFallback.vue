<template>
  <div class="md:h-screen md:flex min-h-screen">
    <div
      class="flex-none w-2/5 bg-signup-image bg-cover bg-no-repeat md:block hidden bg-center"
    ></div>
    <div class="md:px-20 px-6 py-14 md:w-27rem mx-auto">
      <div class="mb-8 md:mb-[144px]">
        <img src="../../assets/icons/Layer_x0020.svg" alt="" class="mx-auto" />
      </div>

      <div class="main-content">
        <div class="text-center flex flex-col items-center">
          <img class="mb-6" src="/invoice-invalid.svg" alt="" />
          <p class="mb-6 text-primary text-lg font-medium">
            Invoice No Longer Valid
          </p>
          <p class="mb-6 text-lessEmphasis">
            Either the invoice has been paid for or it has been canceled
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const route = useRoute();

// const getTrxRefrence = () => {
//   alert(route.query.reference);
// };

// getTrxRefrence();
</script>
