import { createRouter, createWebHashHistory } from 'vue-router'
import Dashboard from '../views/Dashboard/index.vue'

import { useAuthStore } from '@/stores/auth'

import { userInSession } from '@/core/helpers/utility'

const routes = [
  // {
  //   path: '/',
  //   redirect: '/login',
  // },
  {
    path: '/test',
    name: 'dashboard',
    component: () => import('@/views/Dashboard/index.vue'),
  },
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/Auth/Login.vue'),
  },
  {
    path: '/businessinvite',
    name: 'businessinvite',
    component: () => import('@/views/Auth/BusinessInvite.vue'),
  },
  {
    path: '/subscriptionpaymentinvoice',
    name: 'subscriptionpaymentinvoice',
    component: () => import('@/views/Auth/subscription.vue'),
  },
  {
    path: '/subscription-payment-invoice-result',
    name: 'subscription-payment-invoice-result',
    component: () => import('@/views/Auth/paymentResult.vue'),
  },
  {
    path: '/subscription-payment-invoice-fallback',
    name: 'subscription-payment-invoice-fallback',
    component: () => import('@/views/Auth/invoiceFallback.vue'),
  },
  {
    path: '/pos',
    name: 'pos',
    meta: {
      middleware: 'auth',
    },
    component: () => import('@/views/POS/index.vue'),
  },
  {
    path: '/record-sales',
    name: 'record-sales',
    meta: {
      middleware: 'auth',
    },
    component: () => import('@/views/POS/salesRecord.vue'),
  },
  {
    path: '/product',
    name: 'product',
    meta: {
      middleware: 'auth',
    },
    component: () => import('@/views/POS/product.vue'),
  },
  {
    path: '/product/:id',
    name: 'product-details',
    meta: {
      middleware: 'auth',
    },
    component: () => import('@/views/POS/productDetails.vue'),
  },
  {
    path: '/product-group/:id',
    name: 'product-group',
    meta: {
      middleware: 'auth',
    },
    component: () => import('@/views/POS/productGroupItems.vue'),
  },
  {
    path: '/customers',
    name: 'customers',
    meta: {
      middleware: 'auth',
    },
    component: () => import('@/views/POS/Customer/customer.vue'),
  },
  {
    path: '/customer-debt/:id',
    name: 'customer-debt',
    meta: {
      middleware: 'auth',
    },
    component: () => import('@/views/POS/Customer/customerDebt.vue'),
  },
  {
    path: '/todays-sales',
    name: 'todays-sales',
    meta: {
      middleware: 'auth',
    },
    component: () => import('@/views/POS/Sales/currentDayRecord.vue'),
  },
  {
    path: '/sales-success',
    name: 'sales-success',
    meta: {
      middleware: 'auth',
    },
    component: () => import('@/views/POS/Sales/salesSuccesPage.vue'),
  },
  {
    path: '/sales-preview',
    name: 'sales-preview',
    meta: {
      middleware: 'auth',
    },
    component: () => import('@/views/POS/Sales/salesRecordPreview.vue'),
  },
  {
    path: '/sales-record-detail/:id',
    name: 'sales-record-detail',
    meta: {
      middleware: 'auth',
    },
    component: () => import('@/views/POS/Sales/salesRecordDetail.vue'),
  },
  // {
  //   path: '/forgotpassword',
  //   name: 'forgotPassword',
  //   component: () => import('../views/Auth/forgotPassword.vue')
  // },
  // {
  //   path: '/resetpassword',
  //   name: 'resetPassword',
  //   component: () => import('../views/Auth/resetPassword.vue')
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  // window.location.href = "https://theoditor.com/";
  const authStore = useAuthStore()

  // current page view title
  document.title = `${import.meta.env.VITE_APP_NAME}`

  // verify auth token before each page change
  //authStore.verifyAuth();

  // before page access check if page requires authentication
  console.log('middleware', to.meta.middleware)
  if (to.meta.middleware == 'auth') {
    if (userInSession()) {
      next()
    } else {
      next({ name: 'login' })
    }
  } else {
    next()
  }

  // Scroll page to top on every route change
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  })
})

export default router
