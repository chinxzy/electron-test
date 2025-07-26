<template>
  <MasterLayout>
    <template #breadcrumb>
      <Breadcrumb :breadcrumbs="[{ label: 'Product', path: '/product' }]" />
    </template>
    <section class="">
      <div
        class="flex items-center gap-x-2 mb-3 cursor-pointer"
        @click="$router.back()"
      >
        <img src="/images/chevron-left.svg" alt="" />
        <p class="mb-0 text-textGray text-sm">Home / Products</p>
      </div>
      <div class="flex justify-between">
        <div class="relative w-full max-w-md">
          <span
            class="absolute inset-y-0 left-3 flex items-center text-gray-400"
          >
            <img src="/images/search.svg" alt="" class="mr-2" />
          </span>
          <input
            type="text"
            placeholder="Search"
            class="w-full pl-10 pr-4 py-2 border border-[#D7D7D7] rounded-lg text-gray-700 focus:outline-none"
          />
        </div>
        <div>
          <a-dropdown>
            <ButtonComp type="primary" class="w-full">
              <div class="flex items-center gap-x-2">
                <img src="/images/add-circle.svg" alt="" />
                <span class="text-sm font-semibold">Create Products</span>
                <img src="/images/arrow-down.svg" alt="" />
              </div>
            </ButtonComp>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a href="javascript:;" @click="modalOpen = true" class="mb-2"
                    >Create Products</a
                  >
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="productGroupModal = true"
                    >Create Product Group</a
                  >
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>

      <div
        class="flex flex-col items-center mt-20"
        v-if="dataResponse.allCount === 0"
      >
        <img src="/images/lovely-surprise.svg" alt="" class="mt-10 mb-5" />
        <p class="text-alternateBlack text-2xl font-semibold text-center">
          You have not added any product to your business
        </p>
        <ButtonComp
          type="primary"
          class="w-fit h-10 px-6"
          @click="modalOpen = true"
        >
          <div class="flex items-center">
            <img src="/images/add-circle.svg" alt="" class="mr-2" />
            <span class="text-sm font-semibold">Create Products</span>
          </div>
        </ButtonComp>
      </div>
      <TableTab
        class="mt-10"
        v-else
        :tabs="tabs"
        :active-tab="currentTab"
        container-class="bg-white  p-4"
        tab-container-class=""
        tab-text-class=""
        @selectedTab="handleTabChange"
      />
      <LoadingComponent v-if="loading" />
      <div v-else>
        <AllProducts
          v-if="currentTab === 'allProduct'"
          :products="recordList"
          :product-groups="recordGroupList"
        />
        <AttentionRequired
          v-if="currentTab === 'attentionRequired'"
          :products="attentionRequiredList"
          :product-groups="recordGroupList"
        />
      </div>

      <div>
        <CreateProducts
          :modal2-visible="modalOpen"
          :product-groups="recordGroupList"
          @close-modal2="modalOpen = false"
          @reload="reload"
        />
      </div>
      <div>
        <div id="components-modal-demo-position">
          <a-modal
            v-model:open="productGroupModal"
            title="Create Product Group"
            centered
            style="left: 10%"
            width="430px"
            :footer="null"
          >
            <div class="w-full mt-9">
              <label class="text-base"
                >Product Group Name <span class="text-error-500">*</span></label
              >
              <input
                type="text"
                v-model="productGroupData.productGroupName"
                class="w-full px-2 py-1 outline-[#DCE3E780] border border-[#DCE3E780] h-14 required mt-3 rounded-lg"
                placeholder="Enter product group name"
              />
            </div>
            <ButtonComp
              :type="addGroupLoading ? 'primary-disabled' : 'primary'"
              class="w-full h-12 mt-9"
              @click="addProductGroup"
            >
              <span v-if="addGroupLoading">Processing...</span>
              <span v-else>Create Group</span>
            </ButtonComp>
          </a-modal>
        </div>
      </div>
    </section>
  </MasterLayout>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import MasterLayout from "@/components/layout/MasterLayout.vue";
import LoadingComponent from "@/components/ui/loadingComponent.vue";
import Breadcrumb from "@/components/layout/Breadcrumb.vue";
import ButtonComp from "@/components/ui/button.vue";
import CreateProducts from "./Modals/createProducts.vue";
import { usePoductStore } from "@/stores/product";
import type { ProductList, ProductGroupList } from "@/types/product";
import { DefaultCreateProductGroup } from "@/types/product";
import TableTab from "@/components/ui/tab.vue";
import AllProducts from "./Tables/allProducts.vue";
import { openNotificationWithIcon } from "@/core/helpers/utility";
import AttentionRequired from "./Tables/attentionRequired.vue";

const store = usePoductStore();
const recordList = ref<Array<ProductList>>([]);
const attentionRequiredList = ref<Array<ProductList>>([]);
const recordGroupList = ref<Array<ProductGroupList>>([]);
const loading = ref<boolean>(false);
const modalOpen = ref<boolean>(false);
const productGroupModal = ref<boolean>(false);
const addGroupLoading = ref<boolean>(false);
const currentTab = ref("allProduct");
const dataResponse = ref<any>({});
const productGroupData = ref({ ...DefaultCreateProductGroup });

const tabs = ref([
  {
    title: "All Products",
    value: "allProduct",
    count: 0,
  },
  {
    title: "Attention Required",
    value: "attentionRequired",
    count: 0,
  },
  {
    title: "Archived Products",
    value: "archivedProducts",
    count: 0,
  },
]);

function handleTabChange(tab: string) {
  currentTab.value = tab;
}
async function getRecordList() {
  loading.value = true;
  await store
    .getProductList()
    .then((response: any) => {
      recordList.value = response.productItems;
      attentionRequiredList.value = response.attentionRequiredProductItems;
      recordGroupList.value = response.productGroupItems;

      tabs.value[0].count = response.allCounts;
      tabs.value[1].count = response.attentionRequiredCount;
      tabs.value[2].count = response.archivedCount;
    })
    .finally(() => {
      loading.value = false;
    });
}
async function addProductGroup() {
  addGroupLoading.value = true;
  await store
    .createGroup(productGroupData.value)
    .then((response: any) => {
      productGroupModal.value = false;
      productGroupData.value = { ...DefaultCreateProductGroup };
      openNotificationWithIcon("success", null, response.message);
      getRecordList();
    })
    .finally(() => {
      addGroupLoading.value = false;
    });
}
function reload() {
  getRecordList();
  modalOpen.value = false;
}

getRecordList();
</script>
