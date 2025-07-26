import JwtService from '@/core/services/JwtService'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/dist/sweetalert2.min.css'
import { notification } from 'ant-design-vue'
import type { SweetAlertOptions } from 'sweetalert2'
import redCaution from '@/components/ui/redCaution.vue'
import sucessIcon from '@/components/ui/sucessIcon.vue'
import { h } from 'vue'
import moment from 'moment-timezone'
const userDetail = JSON.parse(localStorage.getItem('auth-user') || '{}')
const userCurrency = userDetail?.profileInfo?.businessProfiles[0].currencySymbol || ''
console.log('current', userDetail)
type NotificationType = 'success' | 'info' | 'warning' | 'error'

type DateFormatOptions = {
  date: string | Date
  abbreviateMonth?: boolean
  includeTime?: boolean
}

export const userInSession = (): boolean => {
  const accessToken = JwtService.getToken()
  return !!accessToken
}

// export const formatDate = ({
//   date,
//   abbreviateMonth = true,
//   includeTime = false,
// }: DateFormatOptions) => {
//   if (!date) return "";
//   const options: any = {
//     year: "numeric",
//     month: abbreviateMonth ? "short" : "long",
//     day: "numeric",
//   };
//   const formatedDate = new Date(date).toLocaleDateString("en-US", options);
//   const time = new Date(date).toLocaleTimeString();

//   return includeTime ? `${formatedDate}. ${time}` : `${formatedDate}`;
// };

export const toLocaleDate = (date: string | Date) => {
  if (!date) return
  return new Date(date).toLocaleString()
}

export const isValidEmail = (email: string) => {
  if (email.trim().length !== 0) {
    return !!email.trim().match(/\S+@\S+\.\S+/)
  } else {
    return !email.trim().match(/\S+@\S+\.\S+/)
  }
}

export const showNotification = (options: SweetAlertOptions) => {
  if (options.icon == 'success') {
    options.customClass = {
      confirmButton: 'btn fw-semobold btn-light-primary',
    }
  }

  return Swal.fire(options)
}

export const showSuccessNotification = (text: string) => {
  const options: SweetAlertOptions = {
    text,
    icon: 'success',
    toast: true,
    position: 'top-end',
    timer: 1000,
    timerProgressBar: true,
    showConfirmButton: false,
  }

  return showNotification(options)
}

export const showErrorNotification = (text: string, canRetry = false, callBack?: Function) => {
  const options: SweetAlertOptions = {
    text,
    icon: 'error',
    confirmButtonText: canRetry ? 'Try again' : 'OK',
    showCancelButton: canRetry,
    confirmButtonColor: '#007B86',
  }

  return showNotification(options).then((response) => {
    if (!response.isConfirmed) return
    if (!callBack) return
    callBack()
  })
}

export const openNotificationWithIcon = (
  type: NotificationType,
  message: null,
  description: string,
  duration?: number,
) => {
  notification[type]({
    message: null,
    description: description,
    duration: duration,
    icon: type == 'error' ? h(redCaution) : h(sucessIcon),
    style: {
      backgroundColor: type == 'error' ? '#FFE6E6' : '#B2DFE3',
      color: type == 'error' ? '#FF0000' : '#5976A1',
    },
  })
}

export const formatNumber = (value: number, decimal: number) => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A'
  let num = Number(value)

  return `${userCurrency} ${Number(num).toLocaleString('en', {
    maximumFractionDigits: decimal,
    minimumFractionDigits: decimal,
  })} `
}
export const formatDate = (
  date: string | Date | null | undefined,
  format: string = 'YYYY-MM-DD',
): string | undefined => {
  if (!date) return

  const userTimeZone = moment.tz.guess() // Automatically detect user timezone
  return moment.utc(date).tz(userTimeZone).format(format)
}
export const lowerCase = (str: string) => {
  if (!str || typeof str !== 'string') {
    console.log('invalid argument lowerCase function')
    return 'N/A'
  }
  return str.trim().toLowerCase()
}

export const formatDateTime = (input: string): string => {
  const index = input.indexOf(' ')
  if (index === -1) return input
  return input.slice(0, index) + ' |' + input.slice(index)
}
