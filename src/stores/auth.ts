import { ref, computed } from "vue";
import { defineStore } from "pinia";

import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";

import type { AddToBusiness, BusinessUserSignup, User } from "@/types/auth";

export type loginCredential = {
  username: string;
  password: string;
};

export const useAuthStore = defineStore("auth", () => {
  const errors = ref({});
  const isAuthenticated = ref(!!JwtService.getToken());

  const user = computed<User>(() => {
    const authUser = localStorage.getItem("auth-user");
    if (!authUser) return {} as User;
    return JSON.parse(authUser) as User;
  });

  function setAuth(authUser: User) {
    isAuthenticated.value = true;
    errors.value = {};
    JwtService.saveToken(authUser.accessToken);
    ApiService.setAuthorizationHeader();
    setUser(authUser);
  }

  function setError(error: any) {
    errors.value = { ...error };
  }

  function purgeAuth() {
    isAuthenticated.value = false;
    errors.value = [];
    JwtService.destroyToken();
    localStorage.clear();
  }

  function login(credentials: loginCredential) {
    return ApiService.post("mobile/authenticate-user", credentials)
      .then(({ data }) => {
        setAuth(data);
        return data;
      })
      .catch((response) => {
        setError(response?.data);
        throw response;
      });
  }

  function logout() {
    purgeAuth();
  }

  function register(credentials: BusinessUserSignup) {
    return ApiService.post(
      "web/create-account-and-accept-business-user-invite",
      credentials
    )
      .then(({ data }) => {
        setAuth(data);
        return data;
      })
      .catch(({ response }) => {
        setError(response?.data);
        throw response;
      });
  }

  function addBusiness(credentials: AddToBusiness) {
    return ApiService.post("web/accept-business-user-invite", credentials)
      .then(({ data }) => {
        setAuth(data);
        return data;
      })
      .catch((response) => {
        setError(response?.data);
        throw response;
      });
  }
  function forgotPassword(email: string) {
    return ApiService.post("forgot_password", email)
      .then(() => {
        setError({});
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function verifyAuth() {
    if (JwtService.getToken()) {
      ApiService.setAuthorizationHeader();
      ApiService.post("verify_token", { api_token: JwtService.getToken() })
        .then(({ data }) => {
          setAuth(data);
        })
        .catch(({ response }) => {
          setError(response.data.errors);
          purgeAuth();
        });
    } else {
      purgeAuth();
    }
  }

  function setUser(userDetails: User) {
    localStorage.setItem("auth-user", JSON.stringify(userDetails));
  }

  return {
    errors,
    user,
    isAuthenticated,
    login,
    logout,
    register,
    forgotPassword,
    verifyAuth,
    addBusiness,
  };
});
