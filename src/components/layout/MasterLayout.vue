<template>
  <div class="flex min-h-screen w-full">
    <div class="w-[20%] flex flex-col justify-between bg-primary-700 p-9">
      <Sidebar />
      <ButtonComp type="error" class="w-full h-10 px-6" @click="logout">
        <div class="flex items-center">
          <img src="/images/logout.svg" alt="" class="mr-2" />
          <span class="text-sm font-semibold">Logout</span>
        </div>
      </ButtonComp>
    </div>
    <div class="w-[80%]">
      <div
        class="border-b border-[#DCE3E780] py-6 px-12 flex justify-between w-full"
      >
        <div><slot name="breadcrumb"></slot></div>

        <div class="flex">
          <div
            class="rounded-full h-10 w-10 bg-nurseryBlue-10 flex justify-center items-center text-primary font-medium mr-1"
          >
            {{ shortenedName }}
          </div>
          <div class="space-y-2 text-sm">
            <p class="mb-0">{{ businessName }}</p>
            <p class="mb-0">{{ userName }}</p>
          </div>
        </div>
      </div>
      <div class="px-12 py-3">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Sidebar from "./Sidebar.vue";
import { useRouter } from "vue-router";
import ButtonComp from "@/components/ui/button.vue";
const userDetails = JSON.parse(localStorage.getItem("auth-user") || "{}");
const userName =
  userDetails?.profileInfo?.firstName +
  " " +
  userDetails?.profileInfo?.lastName;
const businessName = userDetails.profileInfo?.businessProfiles[0]?.businessName;
const shortenedName = ref("");
const router = useRouter();
function formatName() {
  const nameArr = userName.split(" ");
  if (!nameArr) return;
  const shortened = nameArr.map((namePart) => {
    return namePart[0];
  });

  shortenedName.value = shortened.join("");
}
function logout() {
  localStorage.clear();
  router.push("/login");
}
formatName();
</script>
