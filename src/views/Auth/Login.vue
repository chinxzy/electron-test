<template>
  <div class="h-screen flex justify-center items-center relative flex">
    <div
      class="flex-none w-1/3 bg-login-image bg-cover bg-no-repeat h-full md:block hidden"
    >
      <div class="pl-16">
        <div class="mt-8 mb-16">
          <a target="_blank" href="https://www.theoditor.com/"
            ><img src="../../assets/icons/ContentLogo.svg" alt=""
          /></a>
        </div>
        <div class="mb-8">
          <h4 class="text-white font-bold">Welcome to Oditor!</h4>
        </div>
        <div v-for="item in contentText" class="flex mb-6">
          <div class="flex-none mr-4">
            <img src="../../assets/images/checkmark-square-03.svg" alt="" />
          </div>
          <div class="flex-1 text-white">
            {{ item }}
          </div>
        </div>
      </div>

      <div
        class="footer absolute bottom-10 text-primary-50 flex justify-center w-1/3 text-sm"
      >
        <div>© 2024 Lintint Technology Limited</div>
        <div class="flex">
          <div class="ml-12 mr-2">
            <img src="../../assets/icons/sms.svg" alt="" />
          </div>
          <div>hello@theoditor.com</div>
        </div>
      </div>
    </div>

    <div class="bg-white overflow-hidden flex-1">
      <div class="md:px-20 px-6 py-14 md:w-33rem mx-auto" id="modal-container">
        <div id="modal-container"></div>

        <div class="mb-8">
          <img
            src="../../assets/icons/Layer_x0020.svg"
            alt=""
            class="mx-auto"
          />
        </div>
        <div class="text-2xl font-bold mb-4 text-center">
          Login to your account
        </div>
        <div class="text-md mb-8 text-center text-lightgray">
          Welcome! We are committed to your business growth
        </div>

        <div class="mb-7">
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Phone number / Email</label
          >
          <div
            class="flex items-center border border-gray-300 p-1 rounded-md h-14"
          >
            <input
              type="email"
              class="w-full px-2 py-1 outline-none"
              placeholder="08012345678"
              v-model="email"
              @input="hasErrorEmail = false"
            />
            <img src="../../assets/icons/messageIcon.svg" alt="" />
          </div>
          <InputError v-if="hasErrorEmail">
            <p v-if="!validEmail && !emptyField">Invalid username</p>
            <p v-if="emptyField">Username required</p>
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
              v-model="password"
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
          <InputError v-if="hasErrorPassword">
            <p>Password required</p>
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
            :disabled="loginLoading"
            @click="ValidateFields"
          >
            <span v-if="loginLoading">Loading...</span>
            <span v-if="!loginLoading">Login</span>
          </ButtonComp>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import ButtonComp from "@/components/ui/button.vue";
import InputError from "@/components/ui/inputError.vue";
import apiError from "@/components/ui/apiError.vue";
import { mailFormat, phoneNumberMaskRule } from "@/core/helpers/constants";
import { openNotificationWithIcon } from "@/core/helpers/utility";
import { useAuthStore, type loginCredential } from "@/stores/auth";

const store = useAuthStore();
const email = ref<string>("");
const password = ref<string>("");
const toastMessage = ref<string>("");
const validEmail = ref<boolean>(true);
const router = useRouter();
const hasErrorEmail = ref<boolean>(false);
const hasErrorPassword = ref<boolean>(false);
const loginLoading = ref<boolean>(false);
const showPass = ref<boolean>(false);
const errorMessage = ref<string>("");
const emptyField = computed(() => {
  return email.value.trim() == "";
});
const passWordEmpty = computed(() => {
  return password.value.trim() == "";
});

const contentText = ref<Array<string>>([
  "Record sales.",
  "Monitor your sales growth",
  "Identify fast selling products",
  "Monitor product activities",
]);
// onBeforeMount(() => {
//   window.location.href = "https://theoditor.com/";
// });

const toggleShow = () => {
  showPass.value = !showPass.value;
};

function ValidateFields() {
  if (
    (!emptyField.value && email.value.match(mailFormat)) ||
    email.value.match(phoneNumberMaskRule)
  ) {
    validEmail.value = true;
  } else {
    validEmail.value = false;
  }

  if (
    emptyField.value == false &&
    validEmail.value == true &&
    passWordEmpty.value == false
  ) {
    login();
  } else {
    if (emptyField.value || !validEmail.value) {
      hasErrorEmail.value = true;
    }
    if (passWordEmpty.value) {
      hasErrorPassword.value = true;
    }
  }
}

const login = async () => {
  const values = {
    username: email.value,
    password: password.value,
  };

  loginLoading.value = true;
  // Send login request
  await store
    .login(values)
    .then(() => {
      openNotificationWithIcon(
        "success",
        null,
        "You have successfully signed in!",
        3
      );
      router.push("/pos");
    })
    .finally(() => (loginLoading.value = false));
};

async function showErrorMessage(error: string) {
  errorMessage.value = error;
}
function closeToast() {
  errorMessage.value = "";
}

function goToForgotPassword() {
  router.push("/forgotpassword");
}

function showToast() {
  toastMessage.value = "This is a timed toast message!";
}
</script>
