console.log(import.meta.env)
import './styles/main.css'
import 'ant-design-vue/dist/reset.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import ApiService from '@/core/services/ApiService'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import Column from 'primevue/column'
import Ripple from 'primevue/ripple'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import DataTable from 'primevue/datatable'

import App from './App.vue'
import router from './router'
import LoadingComponent from './components/ui/loadingComponent.vue'
import ErrorModal from './components/ui/modals/errorModal.vue'
import ButtonComp from './components/ui/button.vue'
import Switch from './components/ui/switch.vue'
import CurrencyInput from './components/ui/currencyInput.vue'

const app = createApp(App)
console.log('🚀 Vue app mounted')

app.use(createPinia())
ApiService.init(app, router)
app.use(router)
app.use(Antd)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'light',
      cssLayer: false,
    },
  },
})
app.use(PrimeVue, { ripple: true })
// app.directive("ripple", Ripple);
app.component('Column', Column)
app.component('DataTable', DataTable)
app.component('LoadingComponent', LoadingComponent)
app.component('ErrorModal', ErrorModal)
app.component('ButtonComp', ButtonComp)
app.component('Switch', Switch)
app.component('VueDatePicker', VueDatePicker)
app.component('CurrencyInput', CurrencyInput)
app.mount('#app')
