import axios from "axios";
import { notifyError, notifySuccess } from "../lib/notifications";

const api = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const publicRoutes = [
    "/auth/login",
    "/auth/signup",
    "/auth/forgot-password",
    "/auth/reset-password",
  ];

  const isPublic = publicRoutes.some((route) => config.url?.startsWith(route));

  if (!isPublic) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase();
    const apiMessage =
      typeof response.data?.message === "string"
        ? response.data.message
        : response.data?.message?.success;
    if (
      ["post", "put", "patch", "delete"].includes(method) &&
      response.config.showSuccessToast !== false
    ) {
      notifySuccess(
        response.config.successMessage ||
          apiMessage ||
          "Operation completed successfully.",
      );
    }
    return response;
  },
  (error) => {
    if (error.config?.showErrorToast !== false) {
      notifyError(error);
    }
    return Promise.reject(error);
  },
);

export default api;
