<template>
  <div id="components-modal-demo-position">
    <a-modal
      v-model:open="props.modal2Visible"
      title="Restock Goods"
      width="30%"
      style="left: 10%"
      :footer="null"
      @cancel="closeModal"
    >
      <div>
        <section
          class="flex items-center bg-nurseryGreen-10 p-2 rounded-lg mt-4"
        >
          <img src="/images/green-bulb.svg" alt="" class="mr-2" />
          <p class="mt-1 text-sm text-lessEmphasis">
            Chukwuemeka Okoro restocked this inventory with 100 yards of Indian
            Lace at 2:00pm May 28, 2024
          </p>
        </section>
        <div class="flex flex-col gap-y-4 mt-4">
          <div class="w-full">
            <label class="text-base text-alternateBlack"
              >Current Quantity</label
            >
            <input
              type="number"
              class="w-full px-2 py-1 outline-[#DCE3E780] h-14 required mt-3 border border-[#DCE3E780] rounded-lg"
              placeholder="Enter current quantity"
            />
          </div>
          <div class="w-full">
            <label class="text-base text-alternateBlack"
              >Measurement Unit</label
            >
            <input
              type="number"
              class="w-full px-2 py-1 outline-[#DCE3E780] h-14 required mt-3 border border-[#DCE3E780] rounded-lg"
              placeholder="Enter measurement unit"
            />
          </div>
          <div class="w-full">
            <label class="text-base text-alternateBlack"
              >Quantity To Restock</label
            >
            <input
              type="number"
              class="w-full px-2 py-1 outline-[#DCE3E780] h-14 required mt-3 border border-[#DCE3E780] rounded-lg"
              placeholder="Enter quantity to restock"
            />
          </div>
          <div class="w-full">
            <label class="text-base text-alternateBlack"
              >Total Quantity Remaining</label
            >
            <input
              type="number"
              class="w-full px-2 py-1 outline-[#DCE3E780] h-14 required mt-3 border border-[#DCE3E780] rounded-lg"
              placeholder="Enter total quantity remaining"
            />
          </div>
          <div class="flex items-start">
            <img src="/images/ep_info-filled.svg" alt="" class="mr-2" />
            <p class="text-sm text-lessEmphasis">
              This is the date the item was restocked in the physical store not
              the date it was recorded on the app.
            </p>
          </div>
          <div class="flex justify-center">
            <ButtonComp :type="'primary'" class="w-[430px] h-16 mt-9">
              <span>Save Changes</span>
            </ButtonComp>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref, defineProps, watch, computed, defineEmits } from "vue";

import { usePoductStore } from "@/stores/product";
import { openNotificationWithIcon } from "@/core/helpers/utility";

// Define props
const props = defineProps<{
  modal2Visible: boolean;
}>();
const emit = defineEmits(["closeModal2", "reload"]);
const closeModal = () => {
  emit("closeModal2");
};
const store = usePoductStore();
</script>
<style scoped>
.border-primary {
  border-color: #0099a8;
}
.bg-primary {
  background-color: #0099a8;
}
</style>
