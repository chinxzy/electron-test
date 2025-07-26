export const mailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const numberRegex = /\d/;
export const phoneNumberMaskRule = /^(\+234|0)[789][01]\d{8}$/;
const LOCATION_HOST = window.location.host;

export const CURRENCY_NAIRA = "₦";

export const USER_SESSION_TIME = LOCATION_HOST.includes("127.0.0.1")
  ? 3600000 // 1 hour for local dev env.
  : 3000000; // 5 minutes for prod
