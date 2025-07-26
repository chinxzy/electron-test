<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onBeforeMount, ref } from 'vue'

import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { throttle } from 'lodash'

import axios, { AxiosError } from 'axios'

import { USER_SESSION_TIME } from '@/core/helpers/constants'
console.log('🚀 Vue app 2 mounted')

const store = useAuthStore()
const router = useRouter()
const route = useRoute()

const sessionTimer = ref<number>(0)

function handleUserSession() {
  axios.interceptors.request.use((request) => {
    throttleObserveSessionTimeout()
    return request
  })

  axios.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.request.status != 401) return Promise.reject(error)
      logout()
    },
  )
}

function observeSessionTimeout() {
  if (route.name == 'login') return

  clearInterval(sessionTimer.value)
  sessionTimer.value = setInterval(() => {
    logout()
  }, USER_SESSION_TIME) as unknown as number
}

function logout() {
  clearInterval(sessionTimer.value)
  store.logout()
  router.push({ name: 'login' })
}

const throttleObserveSessionTimeout = throttle(() => observeSessionTimeout(), 2000, {
  leading: true,
})

handleUserSession()

onBeforeMount(() => {
  window.addEventListener('mousemove', throttleObserveSessionTimeout)
})
</script>

<template>
  <RouterView />
</template>

<style lang="scss">
#app {
  font-family: 'Outfit', sans-serif;
}
p {
  margin: 0;
}
.swal2-icon {
  width: 4em;
  height: 4em;
}

div:where(.swal2-icon).swal2-error [class^='swal2-x-mark-line'][class$='left'] {
  left: 0.6em;
  top: 1.79em !important;
  transform: rotate(45deg);
}

div:where(.swal2-icon).swal2-error [class^='swal2-x-mark-line'][class$='right'] {
  right: 0.5em;
  transform: rotate(-45deg);
  top: 1.8em;
}
.ant-notification-notice-message {
  color: #ea4336 !important;
}
.ant-notification-notice-icon {
  top: 24px !important;
}
</style>
