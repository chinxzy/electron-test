<template>
  <div id="components-modal-demo-position">
    <a-modal
      v-model:open="props.modal2Visible"
      title="Add Customer"
      width="30%"
      style="left: 10%"
      :footer="null"
      @cancel="closeModal"
    >
      <div>
        <div class="flex flex-col gap-y-4 mt-4">
          <div class="w-full">
            <label class="text-base text-alternateBlack">Full Name</label>
            <input
              type="text"
              class="w-full px-2 py-1 outline-[#DCE3E780] h-14 required mt-3 border border-[#DCE3E780] rounded-lg"
              placeholder="Enter customer's name"
              v-model="customerData.name"
            />
            <InputError v-if="!customerData.name && buttonClicked">
              <p class="mb-0" v-if="!customerData.name">
                Customer name is required
              </p>
            </InputError>
          </div>
          <div class="w-full">
            <label class="text-base text-alternateBlack">Phone Number</label>
            <input
              type="text"
              class="w-full px-2 py-1 outline-[#DCE3E780] h-14 required mt-3 border border-[#DCE3E780] rounded-lg"
              placeholder="Enter phone number"
              v-model="customerData.phoneNumber"
            />
          </div>
          <div class="w-full">
            <label class="text-base text-alternateBlack">Email</label>
            <input
              type="email"
              class="w-full px-2 py-1 outline-[#DCE3E780] h-14 required mt-3 border border-[#DCE3E780] rounded-lg"
              placeholder="Enter email address"
              v-model="customerData.email"
            />
          </div>
          <div class="w-full">
            <label class="text-base text-alternateBlack">Note</label>
            <textarea
              type="text"
              rows="10"
              cols="30"
              class="w-full px-2 py-1 outline-[#DCE3E780] h-20 required mt-3 border border-[#DCE3E780] rounded-lg"
              placeholder="Add a note"
              v-model="customerData.note"
            ></textarea>
          </div>

          <div class="flex justify-center">
            <ButtonComp
              :type="'primary'"
              :disabled="addCustomerLoading"
              class="w-[430px] h-16 mt-9"
              @click="addProduct"
            >
              <span v-if="addCustomerLoading">Processing...</span>
              <span v-else>Add Customer</span>
            </ButtonComp>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
  <SuccessModal
    :message="successMessage"
    :isVisible="isSuccessModalVisible"
    @closeIsVisible="isSuccessModalVisible = false"
  />
</template>
<script lang="ts" setup>
import { ref, defineProps, watch, computed, defineEmits } from "vue";

import { useCustomerStore } from "@/stores/customer";
import { openNotificationWithIcon } from "@/core/helpers/utility";
import { DefaultCreateCustomer } from "@/types/customer";
import type { CreateCustomer } from "@/types/customer";
import SuccessModal from "@/components/ui/modals/successModal.vue";

// Define props
const props = defineProps<{
  modal2Visible: boolean;
}>();
const emit = defineEmits(["closeModal2", "reload"]);
const closeModal = () => {
  emit("closeModal2");
};
const store = useCustomerStore();
const addCustomerLoading = ref(false);
const buttonClicked = ref<boolean>(false);
const customerData = ref<CreateCustomer>({
  ...DefaultCreateCustomer,
});
const validations = computed(() => [
  {
    condition: !customerData.value.name,
    message: "Customer name is required",
  },
]);
const isSuccessModalVisible = ref(false);
const successMessage = ref<string>("");

async function addProduct() {
  buttonClicked.value = true;

  for (const { condition, message } of validations.value) {
    if (condition) {
      return;
    }
  }
  addCustomerLoading.value = true;

  await store
    .createCustomer(customerData.value)
    .then((response: any) => {
      isSuccessModalVisible.value = true;
      successMessage.value = response.successMessage;
      emit("reload");
    })
    .finally(() => {
      addCustomerLoading.value = false;
    });
}
</script>
<style scoped>
.border-primary {
  border-color: #0099a8;
}
.bg-primary {
  background-color: #0099a8;
}
</style>
