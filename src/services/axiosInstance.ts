import axios from "axios";
import { reissueAccessToken } from "./instance";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<void> | null = null;

// 요청 인터셉터: accessToken 자동 첨부
instance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터: 401/403 시 토큰 재발급 후 재요청
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      // 동시 요청이 여러 개일 때 refresh를 한 번만 호출
      if (!refreshPromise) {
        refreshPromise = reissueAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      try {
        await refreshPromise;
      } catch (refreshError) {
        const refreshStatus = axios.isAxiosError(refreshError)
          ? refreshError.response?.status
          : undefined;

        const shouldLogout =
          (refreshError instanceof Error &&
            (refreshError.message === "NO_REFRESH_TOKEN" ||
              refreshError.message === "INVALID_TOKEN_RESPONSE")) ||
          refreshStatus === 401 ||
          refreshStatus === 403;

        if (shouldLogout) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }

      const newAccessToken = localStorage.getItem("accessToken");
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      }

      window.location.href = "/login";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default instance;
