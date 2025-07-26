import type { App } from "vue";
import type { AxiosResponse, AxiosRequestConfig } from "axios";
import axios from "axios";
import VueAxios from "vue-axios";
import type { Router } from "vue-router";
import { useErrorModalStore } from "@/stores/errorStore";

import JwtService from "@/core/services/JwtService";
import {
  userInSession,
  openNotificationWithIcon,
} from "@/core/helpers/utility";
const authRoutes = ["businessinvite"];

/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
  /**
   * @description property to share Vue instance
   */
  public static vueInstance: App;
  public static router: Router;

  /**
   * @description initialize Vue Axios
   */
  public static init(app: App<Element>, router: Router) {
    ApiService.vueInstance = app;
    ApiService.router = router;
    ApiService.vueInstance.use(VueAxios, axios);
    ApiService.vueInstance.axios.defaults.baseURL =
      import.meta.env.VITE_APP_API_URL;
    ApiService.vueInstance.axios.defaults.headers.common["Accept"] =
      "application/json";

    if (userInSession()) {
      ApiService.setAuthorizationHeader();
    }

    // Add Axios interceptors
    ApiService.addInterceptors();
  }

  /**
   * @description set the default HTTP request headers
   */
  public static setAuthorizationHeader(): void {
    ApiService.vueInstance.axios.defaults.headers.common["Authorization"] =
      `Bearer ${JwtService.getToken()}`;
  }

  /**
   * @description add Axios interceptors
   */
  private static addInterceptors(): void {
    // Response Interceptor
    ApiService.vueInstance.axios.interceptors.response.use(
      (response: AxiosResponse) => {
        // Intercept file (blob/arraybuffer) responses
        const responseType = response.config.responseType;
        if (responseType === "blob" || responseType === "arraybuffer") {
          // You can handle the file here if needed, or just return the response
          // For example, you could trigger a download here
          // For now, just return the response for further handling
          return response;
        }
        return response;
      },
      (error) => {
        // Handle the response error

        if (
          !authRoutes.includes(
            String(ApiService.router.currentRoute.value.name)
          )
        )
          openNotificationWithIcon(
            "error",
            error.message ? error.message : "Error",
            error.response.data.message
              ? error.response.data.message
              : "An error occurred"
          );

        // Example: Handle unauthorized errors (401)
        if (error.response?.status === 401) {
          openNotificationWithIcon(
            "error",
            error.message,
            "Unathourized.. logging out"
          );
          JwtService.destroyToken();
          location.reload();
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static query(resource: string, params: any): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.get(resource, params);
  }

  // Other methods remain unchanged...
  public static get(resource: string, type?: any): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.get(`${resource}`, type);
  }

  public static post(
    resource: string,
    params: any,
    type?: any
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.post(`${resource}`, params, type);
  }

  public static update(
    resource: string,
    slug: string,
    params: any
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.put(`${resource}/${slug}`, params);
  }

  public static put(resource: string, params: any): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.put(`${resource}`, params);
  }

  public static patch(resource: string, params: any): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.patch(`${resource}`, params);
  }

  public static delete(resource: string): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.delete(resource);
  }
}

export default ApiService;
