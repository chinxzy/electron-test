<template>
  <MasterLayout>
    <template #breadcrumb>
      <Breadcrumb :breadcrumbs="[{ label: 'POS', path: '/pos' }]" />
    </template>
    <section class="">
      <div
        class="flex items-center gap-x-2 mb-9 w-fit cursor-pointer"
        @click="$router.back()"
      >
        <img src="/images/chevron-left.svg" alt="" />
        <p class="mb-0 text-textGray text-sm">Home / Record Sale</p>
      </div>

      <div class="flex justify-between">
        <div>
          <p class="font-medium mb-3">
            Transaction date (The date the sale was made)<span
              class="text-error"
              >*</span
            >
          </p>
          <VueDatePicker
            v-model="transactionDateModel"
            :enable-time-picker="false"
            auto-apply
            placeholder="Select Date"
            :max-date="new Date()"
          />
          <InputError
            v-if="!salesItemData.transactionDate && recoredButtonClicked"
          >
            <p class="mb-0">Transaction date is required</p>
          </InputError>
        </div>

        <div class="w-[305px]">
          <div
            class="flex gap-x-2 mb-3 cursor-pointer"
            @click="modalOpenCustomer = true"
          >
            <img src="/images/add-circle-primary.svg" alt="" />
            <p class="mb-0 text-primary font-medium text-lg">
              Create New Customer
            </p>
          </div>
          <Dropdown
            :buttonText="'Select a customer'"
            :hasSearch="true"
            :isOverlay="true"
            :label="''"
            :options="customerDropdown"
            v-model="salesItemData.customerKey"
          ></Dropdown>
          <InputError v-if="!salesItemData.customerKey && recoredButtonClicked">
            <p class="mb-0">Customer is required</p>
          </InputError>
        </div>
      </div>

      <div class="col-span-2 border border-[#B0B0B0] rounded-xl p-6 mt-9">
        <div class="grid grid-cols-2 border-b border-[#B0B0B0] text-2xl">
          <p class="mb-0">Sales Recorded Today</p>
          <p class="mb-0">List of products in sale</p>
        </div>
        <div class="grid grid-cols-2">
          <!--record form-->
          <div class="form p-6">
            <div class="flex justify-between items-center mb-1">
              <p class="mb-0">Product Name</p>
              <div
                class="flex gap-x-2 mb-3 cursor-pointer"
                @click="modalOpen = true"
              >
                <img src="/images/add-circle-primary.svg" alt="" />
                <p class="mb-0 text-primary font-medium text-lg">
                  Create New Product
                </p>
              </div>
            </div>
            <div class="flex flex-col gap-y-6">
              <div class="w-full">
                <Dropdown
                  :buttonText="'Select product'"
                  :hasSearch="true"
                  :isOverlay="true"
                  :label="''"
                  :isSalesRecord="true"
                  :options="productDropdown"
                  v-model="salesProductData.productKey"
                ></Dropdown>
                <InputError
                  v-if="!salesProductData.productKey && addButtonClicked"
                >
                  <p class="mb-0">Product is required</p>
                </InputError>
              </div>
              <div class="w-full">
                <label class="text-base"
                  >Unit price<span class="text-error-500">*</span></label
                >
                <CurrencyInput v-model="salesProductData.unitPrice" />
              </div>
              <div class="w-full">
                <label class="text-base"
                  >Quantity<span class="text-error-500">*</span></label
                >
                <div class="flex gap-x-4 mt-3">
                  <input
                    type="number"
                    class="w-full px-2 py-1 outline-[#DCE3E780] h-14 required border border-[#DCE3E780] rounded-lg"
                    placeholder="Enter quantity"
                    v-model="salesProductData.quantity"
                  />
                  <input
                    type="text"
                    class="w-full px-2 py-1 outline-[#DCE3E780] h-14 required border border-[#DCE3E780] rounded-lg"
                    placeholder="Measurement unit"
                    :value="selectedProduct?.measurementUnitName"
                    disabled
                  />
                </div>
                <InputError
                  v-if="!salesProductData.quantity && addButtonClicked"
                >
                  <p class="mb-0">Quantity is required</p>
                </InputError>
              </div>
              <span
                v-if="selectedProduct?.productType == 'Goods'"
                class="text-lessEmphasis"
                >Quantity remaining:
                {{
                  Number(selectedProduct?.stockQuantityBalance) -
                  salesProductData.quantity
                }}</span
              >
              <div class="w-full">
                <div class="flex justify-between">
                  <label class="text-base"
                    >Discount
                    <span class="text-black-200">(Optional)</span></label
                  >
                  <div class="flex gap-x-1 items-center">
                    <p class="mb-0">Use %</p>
                    <Switch v-model="salesProductData.discountIsPercentage" />
                  </div>
                </div>
                <div
                  class="grid grid-cols-2 gap-x-4"
                  v-if="salesProductData.discountIsPercentage"
                >
                  <input
                    type="number"
                    class="w-full px-2 py-1 outline-[#DCE3E780] h-14 required mt-3 border border-[#DCE3E780] rounded-lg"
                    placeholder="₦0.00"
                    v-model="discountValue"
                  />
                  <input
                    type="text"
                    class="w-full px-2 py-1 outline-[#DCE3E780] h-14 required mt-3 border border-[#DCE3E780] rounded-lg"
                    placeholder="₦0.00"
                    disabled
                    :value="'₦' + '' + discountDigit"
                  />
                </div>
                <div v-else>
                  <CurrencyInput v-model="discountValue" />
                </div>
              </div>
              <div class="w-full flex justify-between text-primary">
                <p>Sales Price</p>
                <p>
                  {{ formatNumber(discountCalc, 2) }}
                </p>
              </div>
              <div
                class="w-full flex justify-between items center"
                v-if="
                  selectedProduct?.isVATable &&
                  (vatType == 'Exclusive' || vatType == 'Inclusive')
                "
              >
                <div class="flex items-center gap-x-2.5">
                  <p class="mb-0">VAT ({{ formatNumber(vatRate, 1) }}%)</p>
                </div>
                <p v-if="vatType == 'Exclusive'">
                  {{ formatNumber(singleVatCalc, 2) }}
                </p>
                <p v-else>Inclusive</p>
              </div>
              <div class="w-full flex justify-between font-bold">
                <p>Amount due</p>
                <p>
                  {{ formatNumber(singleAmountDue, 2) }}
                </p>
              </div>

              <div class="flex items-center space-x-4">
                <label class="text-lightgray font-medium"
                  >Is Delivery complete?</label
                >

                <label class="flex items-center space-x-1 cursor-pointer">
                  <span class="text-lightgray">Yes</span>
                  <input
                    type="radio"
                    :value="true"
                    v-model="deliveryComplete"
                    class="hidden"
                  />
                  <div
                    class="w-5 h-5 rounded-full border flex items-center justify-center"
                    :class="
                      deliveryComplete ? 'border-primary' : 'border-gray-300'
                    "
                  >
                    <div
                      class="w-3 h-3 rounded-full"
                      :class="deliveryComplete ? 'bg-primary' : ''"
                    ></div>
                  </div>
                </label>

                <label class="flex items-center space-x-1 cursor-pointer">
                  <span class="text-lightgray">No</span>
                  <input
                    type="radio"
                    :value="false"
                    v-model="deliveryComplete"
                    class="hidden"
                  />
                  <div
                    class="w-5 h-5 rounded-full border flex items-center justify-center"
                    :class="
                      !deliveryComplete ? 'border-primary' : 'border-gray-300'
                    "
                  >
                    <div
                      class="w-3 h-3 rounded-full"
                      :class="!deliveryComplete ? 'bg-primary' : ''"
                    ></div>
                  </div>
                </label>
              </div>
              <div
                class="w-full grid grid-cols-2 gap-x-4"
                v-if="!deliveryComplete"
              >
                <div>
                  <label class="text-base"
                    >Quantity Delivered<span class="text-error-500"
                      >*</span
                    ></label
                  >

                  <input
                    type="number"
                    class="w-full px-2 py-1 outline-[#DCE3E780] h-14 required border border-[#DCE3E780] rounded-lg"
                    placeholder="Enter quantity delivered"
                    v-model="salesProductData.quantityDelivered"
                    :max="salesProductData.quantity"
                  />
                </div>
                <div>
                  <label class="text-base">Quantity Remaining</label>

                  <input
                    type="number"
                    class="w-full px-2 py-1 outline-[#DCE3E780] h-14 required border border-[#DCE3E780] rounded-lg"
                    placeholder="Enter quantity delivered"
                    disabled
                    :value="
                      salesProductData.quantity -
                      salesProductData.quantityDelivered
                    "
                  />
                </div>
              </div>
              <!-- <div class="flex items-center space-x-4">
    <label class="text-gray-700 font-medium">Is Delivery complete?</label>

    <label class="flex items-center space-x-1 cursor-pointer">
      <input
        type="radio"
        class="peer hidden"
        name="delivery"
        value="true"
        v-model="salesProductData."
      />
      <div
        class="w-5 h-5 rounded-full border-2 border-primary peer-checked:border-teal-500 peer-checked:bg-teal-500 flex items-center justify-center"
      >
        <div class="w-2 h-2 bg-white rounded-full"></div>
      </div>
      <span>Yes</span>
    </label>

    <label class="flex items-center space-x-1 cursor-pointer">
      <input
        type="radio"
        class="peer hidden"
        name="delivery"
        value="false"
        v-model="deliveryComplete"
      />
      <div
        class="w-5 h-5 rounded-full border-2 border-gray-400 peer-checked:border-teal-500 peer-checked:bg-teal-500 flex items-center justify-center"
      >
        <div class="w-2 h-2 bg-white rounded-full"></div>
      </div>
      <span>No</span>
    </label>
  </div> -->

              <div class="w-full">
                <ButtonComp
                  type="primary"
                  class="w-full h-16"
                  @click="addToSaleList"
                >
                  Add Product To Sale
                </ButtonComp>
              </div>
            </div>
          </div>
          <!--record list-->
          <div class="w-full mt-5" v-if="salesProductArray.length">
            <DataTable
              :value="salesProductArray"
              scrollable
              scrollHeight="600px"
              class="recordData"
            >
              <Column field="" header="">
                <template #body="data">
                  <section
                    class="flex justify-between w-full text-lessEmphasis"
                  >
                    <div class="flex flex-col gap-y-4">
                      <p class="font-medium text-lg text-[#000000]">
                        {{ data.data.productName }}
                      </p>
                      <p>Qty: {{ data.data.quantity }}</p>
                      <p v-if="vatType == 'Exclusive'">
                        VAT: {{ formatNumber(data.data.calculatedVat, 2) }}
                      </p>
                      <p v-if="vatType == 'Inclusive'">VAT: Inclusive</p>
                    </div>
                    <div class="flex flex-col text-right gap-y-4">
                      <div class="flex gap-x-4 justify-end">
                        <img
                          src="/images/edit-2.svg"
                          class="cursor-pointer"
                          alt=""
                          @click="openEditDialog(data.data)"
                        />
                        <img
                          src="/images/close.svg"
                          class="cursor-pointer"
                          alt=""
                          @click="openDeleteModal(data.data)"
                        />
                      </div>
                      <p>
                        Sales Price: {{ formatNumber(data.data.salesPrice, 2) }}
                      </p>
                      <p>
                        Amount Due:
                        {{
                          formatNumber(
                            data.data.salesPrice + data.data.calculatedVat,
                            2
                          )
                        }}
                      </p>
                    </div>
                  </section>
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>
      <!--note-->
      <div class="mt-12 grid grid-cols-2 w-full gap-x-12">
        <div class="w-full">
          <div
            v-if="salesItemData.note.trim() == ''"
            class="flex gap-x-2 mt-6 cursor-pointer"
            @click="addNoteVisible = true"
          >
            <img src="/images/add-circle-primary.svg" alt="" />
            <p class="mb-0 text-primary font-medium text-lg">Add note</p>
          </div>
          <div v-else class="p-6 border border-[#DCE3E780] rounded-xl w-full">
            <div class="flex mb-3 items-center justify-between">
              <p class="text-[#666666] font-semibold">Note</p>
              <div class="flex gap-x-4 justify-end">
                <img
                  src="/images/edit-2.svg"
                  alt=""
                  class="cursor-pointer"
                  @click="addNoteVisible = true"
                />
                <img
                  src="/images/close.svg"
                  alt=""
                  class="cursor-pointer"
                  @click="deleteNote"
                />
              </div>
            </div>
            {{ salesItemData.note }}
          </div>
        </div>
        <div
          class="bg-[#FAFAFA] p-6 flex flex-col gap-y-6 font-medium text-2xl rounded-xl"
        >
          <div class="flex justify-between gap-x-3">
            <p class="mb-0 text-black-100">Total Amount</p>
            <p class="mb-0 text-black-500 text-right">
              {{ formatNumber(totalSalesPrice, 2) }}
            </p>
          </div>

          <div class="flex justify-between gap-x-3">
            <p class="mb-0 text-black-100">VAT (7.5%)</p>
            <p class="mb-0 text-black-500 text-right">
              {{ formatNumber(totalVat, 2) }}
            </p>
          </div>
          <div class="flex justify-between gap-x-3">
            <p class="mb-0 font-bold">Total Amount Due</p>
            <p class="mb-0 font-bold text-right">
              {{ formatNumber(totalAmount, 2) }}
            </p>
          </div>
        </div>
      </div>
      <!--payment details-->
      <div class="p-6 border border-black-100 rounded-xl mt-12">
        <p class="font-medium text-black-100">Payment Details</p>
        <div
          v-for="(payment, idx) in salesItemData.salePayments"
          :key="idx"
          class="grid grid-cols-2 gap-x-12 mt-9"
        >
          <div>
            <div class="w-full">
              <Dropdown
                :buttonText="'Payment Method'"
                :hasSearch="false"
                :isOverlay="true"
                :label="'Payment Method '"
                :options="paymentMethodDropdown"
                v-model="payment.paymentModeKey"
              ></Dropdown>
            </div>
          </div>
          <div class="flex gap-x-2 items-center">
            <div>
              <div class="w-full">
                <label class="text-base"
                  >How much did the customer pay?<span class="text-error-500"
                    >*</span
                  ></label
                >
                <CurrencyInput v-model="payment.amountPaid" />
                <!-- <input
                type="number"
                class="w-full px-2 py-1 outline-[#DCE3E780] h-[52px] required mt-3 border border-[#DCE3E780] rounded-lg"
                placeholder="₦0.00"
                v-model="payment.amountPaid"
                :max="remainingAmount"
              /> -->
                <p
                  v-if="idx === salesItemData.salePayments.length - 1"
                  class="text-[#0077FF] mt-2"
                >
                  Amount Remaining: {{ formatNumber(remainingAmount, 2) }}
                </p>
              </div>
            </div>
            <div
              v-if="salesItemData.salePayments.length > 1"
              class="flex justify-center items-center rounded-lg mt-5 cursor-pointer"
              @click="removePaymentItem(idx)"
            >
              <img src="/images/trash.svg" alt="" />
            </div>
          </div>
        </div>

        <div
          v-if="salesItemData.salePayments.length < 2"
          class="flex gap-x-2 mt-6 cursor-pointer"
          @click="addPaymentMethod"
        >
          <img src="/images/add-circle-primary.svg" alt="" />
          <p class="mb-0 text-primary font-medium text-lg">
            Add another payment
          </p>
        </div>
      </div>
      <div class="flex justify-end items-center">
        <ButtonComp
          :type="'none'"
          class="h-14 mt-9 mb-20"
          @click="previewSales"
        >
          <p class="text-primary font-medium">Preview Sales Record</p>
        </ButtonComp>

        <ButtonComp
          :type="recordSalesLoading ? 'primary-disabled' : 'primary'"
          class="w-[430px] h-14 mt-9 mb-20"
          @click="salesRecordSuccess = true"
        >
          <span>Submit Sales Record</span>
        </ButtonComp>
      </div>
      <div>
        <CreateProducts
          :modal2-visible="modalOpen"
          :product-groups="productGroupList"
          @close-modal2="modalOpen = false"
          @reload="reloadProducts"
        />
      </div>
      <AddCustomer
        :modal2-visible="modalOpenCustomer"
        @close-modal2="modalOpenCustomer = false"
        @reload="getCustomerRecordList"
      />
      <div id="components-modal-demo-position">
        <a-modal
          v-model:open="addNoteVisible"
          title="Note"
          width="20%"
          style="left: 10%"
          :footer="null"
          @cancel="addNoteVisible = false"
        >
          <textarea
            name=""
            id=""
            rows="5"
            class="w-full border border-[#DCE3E780] rounded p-4 foucus:outline-none"
            v-model="notePreview"
          ></textarea>
          <ButtonComp
            :type="'primary'"
            class="w-full h-14 mt-9"
            @click="addNote"
          >
            Add Note
          </ButtonComp>
        </a-modal>
      </div>

      <div id="components-modal-demo-position">
        <a-modal
          v-model:open="deleteModalShow"
          title=""
          width="30%"
          style="left: 10%"
          :footer="null"
          @cancel="deleteModalShow = false"
        >
          <div class="flex flex-col items-center py-15">
            <p class="text-lessEmphasis text-center mt-5">
              Are you sure you want to remove <br />
              {{ productToDelele }} from the list
            </p>
            <ButtonComp
              :type="'error'"
              class="w-[430px] h-14 mt-9 mb-4"
              @click="deleteSalesItem"
            >
              Yes, remove it
            </ButtonComp>

            <p
              class="text-primary font-medium cursor-pointer"
              @click="deleteModalShow = false"
            >
              No, cancel
            </p>
          </div>
        </a-modal>
      </div>
      <!--edit sales data modal-->
      <div id="components-modal-demo-position">
        <a-modal
          v-model:open="editDialogVisible"
          :title="editData.productName"
          width="30%"
          style="left: 10%"
          :footer="null"
          @cancel="deleteModalShow = false"
        >
          <div class="form py-6 px-4">
            <div class="flex flex-col gap-y-6">
              <div class="w-full">
                <label class="text-base"
                  >Unit price<span class="text-error-500">*</span></label
                >
                <CurrencyInput v-model="editData.unitPrice" />
              </div>
              <div class="w-full">
                <label class="text-base"
                  >Quantity<span class="text-error-500">*</span></label
                >
                <div class="flex gap-x-4 mt-3">
                  <input
                    type="number"
                    class="w-full px-2 py-1 outline-[#DCE3E780] h-14 required border border-[#DCE3E780] rounded-lg"
                    placeholder="Enter quantity"
                    v-model="editData.quantity"
                  />
                  <input
                    type="text"
                    class="w-full px-2 py-1 outline-[#DCE3E780] h-14 required border border-[#DCE3E780] rounded-lg"
                    placeholder="Measurement unit"
                    :value="editData.measurementUnitName"
                    disabled
                  />
                </div>
              </div>
              <span
                v-if="selectedProduct?.productType == 'Goods'"
                class="text-lessEmphasis"
                >Quantity remaining:
                {{
                  Number(selectedProduct?.stockQuantityBalance) -
                  salesProductData.quantity
                }}</span
              >
              <div class="w-full">
                <div class="flex justify-between">
                  <label class="text-base"
                    >Discount
                    <span class="text-black-200">(Optional)</span></label
                  >
                  <div class="flex gap-x-1 items-center">
                    <p class="mb-0">Use %</p>
                    <Switch v-model="editData.discountIsPercentage" />
                  </div>
                </div>
                <div
                  class="grid grid-cols-2 gap-x-4"
                  v-if="editData.discountIsPercentage"
                >
                  <input
                    type="number"
                    class="w-full px-2 py-1 outline-[#DCE3E780] h-14 required mt-3 border border-[#DCE3E780] rounded-lg"
                    placeholder="₦0.00"
                    v-model="editDiscountValue"
                  />
                  <input
                    type="text"
                    class="w-full px-2 py-1 outline-[#DCE3E780] h-14 required mt-3 border border-[#DCE3E780] rounded-lg"
                    placeholder="₦0.00"
                    disabled
                    :value="'₦' + '' + editDiscountDigit"
                  />
                </div>
                <div v-else>
                  <CurrencyInput v-model="editData.discountAmount" />
                </div>
              </div>
              <div class="w-full flex justify-between text-primary">
                <p>Sales Price</p>
                <p>
                  ₦
                  {{ formatNumber(editDiscountCalc, 2) }}
                </p>
              </div>
              <div
                class="w-full flex justify-between items center"
                v-if="
                  editData?.isVATable &&
                  (vatType == 'Exclusive' || vatType == 'Inclusive')
                "
              >
                <div class="flex items-center gap-x-2.5">
                  <p class="mb-0">VAT ({{ formatNumber(vatRate, 1) }}%)</p>
                </div>
                <p v-if="vatType == 'Exclusive'">
                  ₦
                  {{ formatNumber(editSingleVatCalc, 2) }}
                </p>
                <p v-else>Inclusive</p>
              </div>
              <div class="w-full flex justify-between font-bold">
                <p>Amount due</p>
                <p>
                  ₦
                  {{ formatNumber(editSingleAmountDue, 2) }}
                </p>
              </div>

              <div class="flex items-center space-x-4">
                <label class="text-lightgray font-medium"
                  >Is Delivery complete?</label
                >

                <label class="flex items-center space-x-1 cursor-pointer">
                  <span class="text-lightgray">Yes</span>
                  <input
                    type="radio"
                    :value="true"
                    v-model="editData.isDeliveryComplete"
                    class="hidden"
                  />
                  <div
                    class="w-5 h-5 rounded-full border flex items-center justify-center"
                    :class="
                      editData.isDeliveryComplete
                        ? 'border-primary'
                        : 'border-gray-300'
                    "
                  >
                    <div
                      class="w-3 h-3 rounded-full"
                      :class="editData.isDeliveryComplete ? 'bg-primary' : ''"
                    ></div>
                  </div>
                </label>

                <label class="flex items-center space-x-1 cursor-pointer">
                  <span class="text-lightgray">No</span>
                  <input
                    type="radio"
                    :value="false"
                    v-model="editData.isDeliveryComplete"
                    class="hidden"
                  />
                  <div
                    class="w-5 h-5 rounded-full border flex items-center justify-center"
                    :class="
                      !editData.isDeliveryComplete
                        ? 'border-primary'
                        : 'border-gray-300'
                    "
                  >
                    <div
                      class="w-3 h-3 rounded-full"
                      :class="!editData.isDeliveryComplete ? 'bg-primary' : ''"
                    ></div>
                  </div>
                </label>
              </div>
              <div
                class="w-full grid grid-cols-2 gap-x-4"
                v-if="!editData.isDeliveryComplete"
              >
                <div>
                  <label class="text-base"
                    >Quantity Delivered<span class="text-error-500"
                      >*</span
                    ></label
                  >

                  <input
                    type="number"
                    class="w-full px-2 py-1 outline-[#DCE3E780] h-14 required border border-[#DCE3E780] rounded-lg"
                    placeholder="Enter quantity delivered"
                    v-model="editData.quantityDelivered"
                    :max="editData.quantity"
                  />
                </div>
                <div>
                  <label class="text-base">Quantity Remaining</label>

                  <input
                    type="number"
                    class="w-full px-2 py-1 outline-[#DCE3E780] h-14 required border border-[#DCE3E780] rounded-lg"
                    placeholder="Enter quantity delivered"
                    disabled
                    :value="editData.quantity - editData.quantityDelivered"
                  />
                </div>
              </div>

              <div class="w-full">
                <ButtonComp
                  type="primary"
                  class="w-full h-16"
                  @click="saveEdit"
                >
                  Save Changes
                </ButtonComp>
              </div>
            </div>
          </div>
        </a-modal>
      </div>
      <div id="components-modal-demo-position">
        <a-modal
          v-model:open="salesRecordSuccess"
          title=""
          width="30%"
          style="left: 10%"
          :closable="false"
          :footer="null"
          @cancel="deleteModalShow = false"
        >
          <div class="flex justify-center w-full p-4">
            <div class="text-center w-full">
              <img src="/images/files.svg" alt="" class="mx-auto w-[138px]" />
              <p class="font-semibold text-2xl mt-6 mb-4">
                Submit Sales Record
              </p>
              <p class="mb-6">
                Are you sure you want to submit this sales record
              </p>
              <div class="flex gap-x-6">
                <ButtonComp
                  :type="recordSalesLoading ? 'primary-disabled' : 'primary'"
                  class="w-full h-12"
                  @click="recordSales"
                >
                  <span v-if="recordSalesLoading">Processing...</span>
                  <span v-else>Yes, Submit</span>
                </ButtonComp>
                <ButtonComp
                  type="error"
                  class="w-full h-12"
                  @click="salesRecordSuccess = false"
                >
                  No, Cancel
                </ButtonComp>
              </div>
            </div>
          </div>
        </a-modal>
      </div>
      <SuccessModal
        :isVisible="isSuccessModalVisible"
        @closeIsVisible="isSuccessModalVisible = false"
        :message="modalMessage"
      />
    </section>
  </MasterLayout>
</template>
<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import MasterLayout from "@/components/layout/MasterLayout.vue";
import Breadcrumb from "@/components/layout/Breadcrumb.vue";
import ButtonComp from "@/components/ui/button.vue";
import CreateProducts from "./Modals/createProducts.vue";
import type { ProductGroupList, MeasurementUnit } from "@/types/product";
import { useCustomerStore } from "@/stores/customer";
import type { CustomerList } from "@/types/customer";
import { usePoductStore } from "@/stores/product";
import moment from "moment";
import AddCustomer from "./Modals/addCustomer.vue";
import type {
  CreateSalesItem,
  SaleProducts,
  ProductSalesList,
  paymentMethods,
} from "@/types/sales";
import { defaultSaleItem, defaultSalesProduct } from "@/types/sales";
import { formatNumber, openNotificationWithIcon } from "@/core/helpers/utility";
import { useSalesStore } from "@/stores/sales";
import SuccessModal from "@/components/ui/modals/successModal.vue";
import { useRouter } from "vue-router";
interface editSalesData {
  calculatedVat: number;
  discountAmount: number;
  discountIsPercentage: boolean;
  discountPercentage: number;
  isVATable: boolean;
  measurementUnitKey: string;
  productKey: string;
  productName: string;
  quantity: number;
  quantityDelivered: number;
  salesPrice: number;
  unitPrice: number;
  measurementUnitName: string;
  isDeliveryComplete: boolean;
}
const salesRecordSuccess = ref<boolean>(false);
const productStore = usePoductStore();
const customerStore = useCustomerStore();
const salesStore = useSalesStore();
const productGroupList = ref<Array<ProductGroupList>>([]);
const modalOpen = ref<boolean>(false);
const modalOpenCustomer = ref<boolean>(false);
const deliveryComplete = ref<boolean>(true);
const recordSalesLoading = ref<boolean>(false);
const addNoteVisible = ref<boolean>(false);
const deleteModalShow = ref<boolean>(false);
const productList = ref<Array<ProductSalesList>>([]);
const customerList = ref<Array<CustomerList>>([]);
const paymentMethods = ref<Array<paymentMethods>>([]);
const measurementList = ref<Array<MeasurementUnit>>([]);
const notePreview = ref<string>("");
const salesProductArray = ref<any>([]);
const editDialogVisible = ref(false);
const productToDelele = ref("");
const modalMessage = ref<string>("");
const isSuccessModalVisible = ref(false);
const addButtonClicked = ref(false);
const recoredButtonClicked = ref(false);

const salesItemData = ref<CreateSalesItem>({
  ...defaultSaleItem,
});
const router = useRouter();
const editData = ref<editSalesData>({
  calculatedVat: 0,
  discountAmount: 0,
  discountIsPercentage: false,
  discountPercentage: 0,
  isVATable: false,
  measurementUnitKey: "",
  productKey: "",
  productName: "",
  quantity: 0,
  quantityDelivered: 0,
  salesPrice: 0,
  unitPrice: 0,
  measurementUnitName: "",
  isDeliveryComplete: true,
});
const vatRate = ref(0);
const userDetails = JSON.parse(localStorage.getItem("auth-user") || "{}");
const vatType = userDetails.profileInfo.vatApplicationType;

// Computed property for date picker v-model
const transactionDateModel = computed({
  get() {
    return salesItemData.value.transactionDate
      ? new Date(salesItemData.value.transactionDate)
      : null;
  },
  set(val: Date | null) {
    salesItemData.value.transactionDate = val
      ? moment(val).format("YYYY-MM-DD")
      : "";
  },
});

const totalSalesPrice = computed<number>(() => {
  return salesProductArray.value.reduce(
    (sum: any, item: any) => sum + item.salesPrice,
    0
  );
});
const totalVat = computed<number>(() => {
  if (vatType == "Exclusive") {
    return salesProductArray.value.reduce(
      (sum: any, item: any) => sum + item.calculatedVat,
      0
    );
  } else {
    return 0;
  }
});
const totalAmount = computed<number>(() => {
  return totalSalesPrice.value + totalVat.value;
});

const salesProductData = ref<SaleProducts>({
  ...defaultSalesProduct,
});

const discountValue = computed({
  get() {
    return salesProductData.value.discountIsPercentage
      ? salesProductData.value.discountPercentage
      : salesProductData.value.discountAmount;
  },
  set(val: number) {
    if (salesProductData.value.discountIsPercentage) {
      salesProductData.value.discountPercentage = val;
    } else {
      salesProductData.value.discountAmount = val;
    }
  },
});

const editDiscountValue = computed({
  get() {
    return editData.value.discountIsPercentage
      ? editData.value.discountPercentage
      : editData.value.discountAmount;
  },
  set(val: number) {
    if (editData.value.discountIsPercentage) {
      editData.value.discountPercentage = val;
    } else {
      editData.value.discountAmount = val;
    }
  },
});
const singleVatCalc = computed<number>(() => {
  if (selectedProduct.value?.isVATable) {
    return (discountCalc.value * 7.5) / 100;
  } else {
    return 0;
  }
});
const editSingleVatCalc = computed<number>(() => {
  if (editData.value?.isVATable) {
    return (editDiscountCalc.value * 7.5) / 100;
  } else {
    return 0;
  }
});

const discountCalc = computed<number>(() => {
  if (salesProductData.value.discountIsPercentage) {
    return (
      salesProductData.value.quantity * salesProductData.value.unitPrice -
      (salesProductData.value.quantity *
        salesProductData.value.unitPrice *
        salesProductData.value.discountPercentage) /
        100
    );
  } else {
    return (
      salesProductData.value.quantity * salesProductData.value.unitPrice -
      salesProductData.value.discountAmount
    );
  }
});

const editDiscountCalc = computed<number>(() => {
  if (editData.value.discountIsPercentage) {
    return (
      editData.value.quantity * editData.value.unitPrice -
      (editData.value.quantity *
        editData.value.unitPrice *
        editData.value.discountPercentage) /
        100
    );
  } else {
    return (
      editData.value.quantity * editData.value.unitPrice -
      editData.value.discountAmount
    );
  }
});

const discountDigit = computed<number>(() => {
  if (salesProductData.value.discountIsPercentage) {
    return (
      (salesProductData.value.quantity *
        salesProductData.value.unitPrice *
        salesProductData.value.discountPercentage) /
      100
    );
  }
  return 0;
});

const editDiscountDigit = computed<number>(() => {
  if (editData.value.discountIsPercentage) {
    return (
      (editData.value.quantity *
        editData.value.unitPrice *
        editData.value.discountPercentage) /
      100
    );
  }
  return 0;
});

const singleAmountDue = computed<number>(() => {
  if (vatType == "Exclusive") {
    return discountCalc.value + singleVatCalc.value;
  } else {
    return discountCalc.value;
  }
});

const editSingleAmountDue = computed<number>(() => {
  if (vatType == "Exclusive") {
    return editDiscountCalc.value + editSingleVatCalc.value;
  } else {
    return editDiscountCalc.value;
  }
});

const productDropdown = computed(() => {
  return (productList ?? []).value.map((item) => ({
    label: item.name,
    subLabel1: item.price,
    subLabel2: item.stockQuantityBalance,
    value: item.productKey,
  }));
});
const customerDropdown = computed(() => {
  return (customerList ?? []).value.map((item) => ({
    label: item.customerName,
    value: item.customerKey,
  }));
});

const paymentMethodDropdown = computed(() => {
  return paymentMethods.value.map((item) => ({
    label: item.displayName,
    value: item.paymentModeKey,
  }));
});

const selectedProduct = computed(() => {
  return productList.value.find(
    (item) => item.productKey == salesProductData.value.productKey
  );
});

const totalPaid = computed(() =>
  salesItemData.value.salePayments.reduce((sum, p) => sum + p.amountPaid, 0)
);

const remainingAmount = computed(() =>
  Math.max(totalAmount.value - totalPaid.value, 0)
);

const editValue = ref({});

async function getProductList() {
  await productStore.getProductList().then((response: any) => {
    productGroupList.value = response.productGroupItems;
  });
}

async function getRecordList() {
  await salesStore.getSalesProductList().then((response: any) => {
    productList.value = response;
  });
}

async function getPaymentMethodList() {
  await salesStore.getPaymentMethod().then((response: any) => {
    paymentMethods.value = response;
  });
}

async function getMeasurementUnitList() {
  await productStore.getMeasurementUnits().then((response: any) => {
    measurementList.value = response;
  });
}

async function getCustomerRecordList() {
  modalOpenCustomer.value = false;

  await customerStore.getCustomerList().then((response: any) => {
    customerList.value = response;
  });
}
async function getVatRate() {
  await productStore.getVatRate().then((response: any) => {
    vatRate.value = response.vatRate;
  });
}

// Method to delete a sales item from the array
function deleteSalesItem(index: number) {
  // Get the item to delete from salesProductArray
  const item = salesProductArray.value[index];
  // Remove from salesProductArray
  salesProductArray.value.splice(index, 1);

  // Remove from saleProducts if it exists (match by productKey)
  if (item && Array.isArray(salesItemData.value.saleProducts)) {
    const saleProducts = salesItemData.value.saleProducts;
    const matchIdx = saleProducts.findIndex(
      (p) => p.productKey === item.productKey
    );
    if (matchIdx !== -1) {
      saleProducts.splice(matchIdx, 1);
    }
    deleteModalShow.value = false;
  }
}
function openDeleteModal(data: any) {
  productToDelele.value = data.productName;
  editValue.value = {};
  deleteModalShow.value = true;
}

function addToSaleList() {
  addButtonClicked.value = true;
  if (
    !salesProductData.value.productKey ||
    !salesProductData.value.unitPrice ||
    !salesProductData.value.quantity ||
    !salesProductData.value.measurementUnitKey
  ) {
    return;
  }
  if (deliveryComplete.value) {
    salesProductData.value.quantityDelivered = salesProductData.value.quantity;
  }
  if (salesProductData.value.discountPercentage == 0) {
    salesProductData.value.discountIsPercentage == false;
  }
  // Add the product to the sales item
  salesProductArray.value.push({
    ...salesProductData.value,
    salesPrice: discountCalc.value,
    calculatedVat: singleVatCalc.value,
    measurementUnitName: selectedProduct.value?.measurementUnitName,
    isDeliveryComplete: deliveryComplete.value,
  });
  addButtonClicked.value = false;

  // Reset the sales product data
  salesProductData.value = { ...defaultSalesProduct };
}

function addPaymentMethod() {
  if (
    remainingAmount.value == 0 ||
    salesItemData.value.salePayments[0].amountPaid == 0 ||
    !salesItemData.value.salePayments[0].paymentModeKey
  ) {
    return;
  }
  salesItemData.value.salePayments.push({
    amountPaid: 0,
    paymentModeKey: "",
  });
}

function addNote() {
  salesItemData.value.note = notePreview.value;
  addNoteVisible.value = false;
}
function deleteNote() {
  notePreview.value = "";
  salesItemData.value.note = "";
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result); // This is a full data URL, like "data:application/pdf;base64,..."
    };

    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function recordSales() {
  recoredButtonClicked.value = true;

  salesItemData.value.saleProducts = salesProductArray.value.map(
    (item: SaleProducts) => ({
      productKey: item.productKey,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      measurementUnitKey: item.measurementUnitKey,
      discountAmount: item.discountIsPercentage ? 0 : item.discountAmount,
      discountIsPercentage: item.discountIsPercentage,
      discountPercentage: item.discountPercentage,
      isVATable: item.isVATable,
      quantityDelivered: item.quantityDelivered,
    })
  );

  if (
    !salesItemData.value.customerKey ||
    !salesItemData.value.transactionDate ||
    !salesItemData.value.salePayments.length ||
    !salesItemData.value.saleProducts.length
  ) {
    salesRecordSuccess.value = false;
    return;
  }
  recordSalesLoading.value = true;
  await salesStore
    .recordSales(salesItemData.value)
    .then(async (response: any) => {
      // Ensure response is an ArrayBuffer or valid Blob source
      const base64 = await blobToBase64(response);

      localStorage.setItem("sales-receipt", base64);
      router.push("/sales-success");

      salesItemData.value = { ...defaultSaleItem };
    })
    .finally(() => (recordSalesLoading.value = false));
}
function openEditDialog(product: any) {
  editData.value = { ...product }; // Clone to avoid direct mutation
  editDialogVisible.value = true;
}
function saveEdit() {
  const index = salesProductArray.value.findIndex(
    (p: any) => p.productKey === editData.value.productKey
  );
  if (index !== -1) {
    // Update each property to preserve reactivity
    Object.keys(editData.value).forEach((key) => {
      salesProductArray.value[index][key] = (editData.value as any)[key];
    });
    salesProductArray.value[index].salesPrice = editDiscountCalc.value;
  }
  editDialogVisible.value = false;
  modalMessage.value = "Product Information updated successfully";
  isSuccessModalVisible.value = true;
}
function reloadProducts() {
  modalOpen.value = false;
  modalMessage.value = "Product created successfully";
  isSuccessModalVisible.value = true;
  getRecordList();
}
function previewSales() {
  recoredButtonClicked.value = true;
  const salesItemForPreview = salesItemData.value;
  salesItemForPreview.saleProducts = salesProductArray.value.map(
    (item: any) => ({
      productKey: item.productKey,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      measurementUnitKey: item.measurementUnitKey,
      discountAmount: item.discountAmount,
      discountIsPercentage: item.discountIsPercentage,
      discountPercentage: item.discountPercentage,
      isVATable: item.isVATable,
      quantityDelivered: item.quantityDelivered,
      measurementUnitName: item.measurementUnitName,
      salesPrice: item.salesPrice,
      calculatedVat: item.calculatedVat,
    })
  );
  if (
    !salesItemData.value.customerKey ||
    !salesItemData.value.transactionDate ||
    !salesItemData.value.salePayments.length ||
    !salesItemData.value.saleProducts.length
  ) {
    return;
  }
  localStorage.setItem("salesPreview", JSON.stringify(salesItemForPreview));
  router.push("/sales-preview");
}
function removePaymentItem(index: number) {
  salesItemData.value.salePayments.splice(index, 1);
}
watch(
  salesProductData,
  (newVal) => {
    salesProductData.value.productName =
      productList.value.find((item) => item.productKey === newVal.productKey)
        ?.name || "";
  },
  {
    deep: true,
    immediate: true,
  }
);
watch(deliveryComplete, () => {
  if (deliveryComplete.value) {
    salesProductData.value.quantityDelivered = salesProductData.value.quantity;
  }
});
watch(
  selectedProduct,
  (newVal) => {
    salesProductData.value.unitPrice = selectedProduct.value?.price || 0;
    salesProductData.value.measurementUnitKey =
      selectedProduct.value?.measurementUnitKey || "";
    salesProductData.value.isVATable =
      selectedProduct.value?.isVATable || false;
  },
  {
    deep: true,
    immediate: true,
  }
);
getRecordList();
getProductList();
getMeasurementUnitList();
getCustomerRecordList();
getVatRate();
getPaymentMethodList();
</script>
<style lang="scss">
:where(.css-dev-only-do-not-override-1p3hq3p).ant-picker {
  width: 382px;
  height: 54px;
}
.recordData {
  .p-datatable-header-cell {
    display: none !important;
  }
}
</style>
