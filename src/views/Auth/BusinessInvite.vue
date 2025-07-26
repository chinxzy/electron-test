<template>
  <div class="md:h-[1040px] md:flex min-h-screen">
    <div
      class="flex-none w-2/5 bg-signup-image bg-cover bg-no-repeat md:block hidden bg-center"
    ></div>

    <div
      class="bg-white overflow-hidden md:flex-1 md:w-1/2"
      v-if="!userStatus && inviteSuccess == null"
    >
      <div class="md:px-20 px-6 py-14 md:w-33rem mx-auto">
        <div class="mb-8">
          <img
            src="../../assets/icons/Layer_x0020.svg"
            alt=""
            class="mx-auto"
          />
        </div>

        <div class="mb-7">
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Email</label
          >
          <div
            class="flex items-center border border-gray-300 p-1 rounded-md h-14 bg-[#F4F4F4]"
          >
            <input
              type="email"
              class="w-full px-2 py-1 outline-none"
              placeholder="you@example.com"
              v-model="signupValues.email"
              @input="hasErrorEmail = false"
              disabled
            />
          </div>
          <!-- <InputError v-if="hasErrorEmail">
            <p v-if="!validEmail && !emptyField">Invalid username</p>
            <p v-if="emptyField">Username required</p>
          </InputError> -->
        </div>
        <div class="mb-7">
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-900"
            >First Name</label
          >
          <div
            class="flex items-center border border-gray-300 p-1 rounded-md h-14"
          >
            <input
              type="text"
              class="w-full px-2 py-1 outline-none"
              placeholder="First Name"
              v-model="signupValues.firstName"
              @input="hasErrorEmail = false"
            />
          </div>
          <InputError v-if="!signupValues.firstName && buttonClicked">
            <p class="mb-0" v-if="!signupValues.firstName">
              First name required
            </p>
          </InputError>
        </div>
        <div class="mb-7">
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Last Name</label
          >
          <div
            class="flex items-center border border-gray-300 p-1 rounded-md h-14"
          >
            <input
              type="text"
              class="w-full px-2 py-1 outline-none"
              placeholder="Last Name"
              v-model="signupValues.lastName"
              @input="hasErrorEmail = false"
            />
          </div>
          <InputError v-if="!signupValues.lastName && buttonClicked">
            <p class="mb-0" v-if="!signupValues.lastName">Last name required</p>
          </InputError>
        </div>
        <div class="mb-7">
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Phone Number</label
          >
          <div class="flex items-center gap-x-2">
            <div
              class="flex justify-around border border-gray-300 p-1 rounded-md h-14 items-center w-1/3 gap-x-1"
            >
              <img src="/images/flag_ngn.svg" class="md:w-5 w-4" alt="" />
              <p class="m-0 text-sm md:text-base">+234</p>
              <img src="/images/angle-down.svg" alt="" />
            </div>
            <input
              type="text"
              class="w-full px-2 py-1 outline-none border border-gray-300 p-1 rounded-md h-14"
              placeholder="08012345678"
              v-model="signupValues.phoneNumber"
              @input="hasErrorEmail = false"
            />
          </div>
          <InputError
            v-if="
              (!signupValues.phoneNumber && buttonClicked) ||
              (phoneError && buttonClicked)
            "
          >
            <p class="mb-0" v-if="!signupValues.phoneNumber">
              Phone number required
            </p>
            <p class="mb-0" v-if="signupValues.phoneNumber && phoneError">
              Invalid phone number
            </p>
          </InputError>
        </div>

        <div class="mb-7">
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Password</label
          >
          <div
            class="flex items-center border border-gray-300 p-1 rounded-md h-14"
          >
            <input
              :type="!showPass ? 'password' : 'text'"
              class="w-full px-2 py-1 outline-none"
              placeholder="Enter password"
              v-model="signupValues.password"
              @input="hasErrorPassword = false"
            />
            <img
              v-if="!showPass"
              src="../../assets/icons/eye.svg"
              alt=""
              class="cursor-pointer"
              @click="toggleShow"
            />
            <img
              v-if="showPass"
              src="../../assets/icons/eye-slash.svg"
              alt=""
              class="cursor-pointer"
              @click="toggleShow"
            />
          </div>
          <InputError v-if="!signupValues.password && buttonClicked">
            <p class="mb-0">Password required</p>
          </InputError>
        </div>
        <div class="mb-7">
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Confirm Password</label
          >
          <div
            class="flex items-center border border-gray-300 p-1 rounded-md h-14"
          >
            <input
              :type="!showConfirmPass ? 'password' : 'text'"
              class="w-full px-2 py-1 outline-none"
              placeholder="Confirm password"
              v-model="confirmPassword"
              @input="hasErrorPassword = false"
            />
            <img
              v-if="!showConfirmPass"
              src="../../assets/icons/eye.svg"
              alt=""
              class="cursor-pointer"
              @click="toggleShowConfirm"
            />
            <img
              v-if="showConfirmPass"
              src="../../assets/icons/eye-slash.svg"
              alt=""
              class="cursor-pointer"
              @click="toggleShowConfirm"
            />
          </div>
          <InputError v-if="!issamePassword">
            <p class="mb-0">Passwords do not match</p>
          </InputError>
        </div>
        <!-- <div
          class="mb-7 text-right text-primary cursor-pointer"
          @click="goToForgotPassword"
        >
          Forgot Password
        </div> -->
        <div class="flex justify-center">
          <ButtonComp
            type="primary"
            class="w-full h-14"
            @click="register"
            :disabled="loginLoading"
          >
            <span v-if="loginLoading">Loading...</span>
            <span v-if="!loginLoading">Create Account</span>
          </ButtonComp>
        </div>
        <div></div>
      </div>
    </div>
    <div
      class="bg-white overflow-hidden md:flex-1 md:px-20 px-6"
      v-if="userStatus && inviteSuccess == null"
    >
      <img
        src="../../assets/icons/Layer_x0020.svg"
        alt=""
        class="mx-auto md:mb-24 mt-8 mb-14"
      />
      <LoadingComponent v-if="loginLoading" />
    </div>
    <div
      class="bg-white overflow-hidden md:flex-1 md:px-20 px-6 py-14 md:w-33rem mx-auto"
      v-if="inviteSuccess != null"
    >
      <div class="mb-8">
        <img src="../../assets/icons/Layer_x0020.svg" alt="" class="mx-auto" />
      </div>
      <div class="flex justify-center w-full" v-if="inviteSuccess">
        <div class="">
          <img src="/images/welcome.svg" alt="" class="mx-auto" />
          <p class="text-lessEmphasis mt-12">
            {{ responseMessage }}
          </p>
        </div>
      </div>

      <div
        class="flex justify-center w-full md:mt-40 mt-20"
        v-if="!inviteSuccess"
      >
        <div class="text-center">
          <img
            src="../../assets/icons/red-caution.svg"
            alt=""
            class="mx-auto w-14"
          />
          <p class="text-errorMain font-semibold text-[18px] mt-6 mb-4">
            Error
          </p>
          <p class="text-lessEmphasis mb-6">
            {{ errorMessage }}
          </p>
          <ButtonComp type="danger" class="w-full h-12" @click="goToOditor">
            OK
          </ButtonComp>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import ButtonComp from "@/components/ui/button.vue";

import InputError from "@/components/ui/inputError.vue";
import apiError from "@/components/ui/apiError.vue";
import { mailFormat, phoneNumberMaskRule } from "@/core/helpers/constants";
import {
  openNotificationWithIcon,
  showSuccessNotification,
} from "@/core/helpers/utility";
import { useAuthStore } from "@/stores/auth";
import type { BusinessUserSignup } from "@/types/auth";
import { defaultAddToBusiness, defaultBusinessUserSignup } from "@/types/auth";

const router = useRouter();
const route = useRoute();
const store = useAuthStore();
const signupValues = ref({ ...defaultBusinessUserSignup });
const addBusinessValue = ref({ ...defaultAddToBusiness });
const confirmPassword = ref<string>("");
const hasErrorEmail = ref<boolean>(false);
const hasErrorPassword = ref<boolean>(false);
const userStatus = ref<boolean>(false);
const loginLoading = ref<boolean>(false);
const showPass = ref<boolean>(false);
const showConfirmPass = ref<boolean>(false);
const validEmail = ref<boolean>(false);
const errorMessage = ref<string>("");
const responseMessage = ref<string>("");
const inviteSuccess = ref<boolean | null>(null);
const buttonClicked = ref<boolean>(false);
const phoneError = computed(
  () => !signupValues.value.phoneNumber.match(phoneNumberMaskRule)
);
const issamePassword = computed(
  () => signupValues.value.password === confirmPassword.value
);

const validations = computed(() => [
  {
    condition: !signupValues.value.firstName,
    message: "First name is required",
  },
  { condition: !signupValues.value.lastName, message: "Last name is required" },
  {
    condition: !signupValues.value.phoneNumber,
    message: "Phone number is required",
  },
  {
    condition: !signupValues.value.phoneNumber.match(phoneNumberMaskRule),
    message: "Invalid phone number",
  },
  { condition: !signupValues.value.password, message: "Password is required" },
  {
    condition: signupValues.value.password !== confirmPassword.value,
    message: "Passwords do  not match",
  },
]);

function getRouteDetails() {
  signupValues.value.email = String(route.query.userEmail);
  signupValues.value.businessKey = String(route.query.businessAddress);
  signupValues.value.businessUserInvitationKey = String(
    route.query.inviteAddress
  );
  addBusinessValue.value.businessKey = String(route.query.businessAddress);
  addBusinessValue.value.businessUserInvitationKey = String(
    route.query.inviteAddress
  );

  const UserStatus = String(route.query.userStatus).toLocaleLowerCase();
  userStatus.value = UserStatus === "true";
  if (userStatus.value) {
    addToBusiness();
  }
}

const toggleShow = () => {
  showPass.value = !showPass.value;
};
const toggleShowConfirm = () => {
  showConfirmPass.value = !showConfirmPass.value;
};

const register = () => {
  buttonClicked.value = true;
  for (const { condition, message } of validations.value) {
    if (condition) {
      return;
    }
  }

  loginLoading.value = true;
  store
    .register(signupValues.value)
    .then((response) => {
      if (response) {
        inviteSuccess.value = true;
        responseMessage.value = response;
      }
    })
    .catch((error) => {
      inviteSuccess.value = false;

      errorMessage.value = error.data.message;
    })
    .finally(() => {
      loginLoading.value = false;
    });
};
function addToBusiness() {
  loginLoading.value = true;

  store
    .addBusiness(addBusinessValue.value)
    .then((response) => {
      // Add success-specific logic only if the response is truly successful
      if (response) {
        inviteSuccess.value = true;
        responseMessage.value = response;
      }
    })
    .catch((error) => {
      errorMessage.value = error.response.data.message;
      inviteSuccess.value = false;
    })
    .finally(() => {
      loginLoading.value = false;
    });
}

async function showErrorMessage(error: string) {
  errorMessage.value = error;
}
function closeToast() {
  errorMessage.value = "";
}
function goToOditor() {
  window.location.href = "https://theoditor.com";
}
function goToForgotPassword() {
  router.push("/forgotpassword");
}
getRouteDetails();

watch(userStatus, async (newValue, oldValue) => {
  console.log(`userStatus changed from ${oldValue} to ${newValue}`);
  // if (newValue) {
  //   try {
  //     await addToBusiness();
  //   } catch (err) {
  //     console.error("Error in addToBusiness:", err);
  //   }
  // }
});
</script>
