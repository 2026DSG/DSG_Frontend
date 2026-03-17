import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

// 토큰 저장소
let accessToken: string | null = null;

const getStoredRefreshToken = (): string | null => {
  try {
    return localStorage.getItem("refreshToken");
  } catch {
    return null;
  }
};

const setStoredRefreshToken = (token: string): void => {
  try {
    localStorage.setItem("refreshToken", token);
  } catch {
    console.warn("localStorage 저장 실패");
  }
};

const removeStoredRefreshToken = (): void => {
  try {
    localStorage.removeItem("refreshToken");
  } catch {
    console.warn("localStorage 삭제 실패");
  }
};

let refreshToken: string | null = getStoredRefreshToken();

// 동시 요청 race condition 처리
let isRefreshing = false;

let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// 로그아웃 이벤트
export const AUTH_LOGOUT_EVENT = "auth:logout";

const dispatchLogout = () => {
  window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT));
};

// axios 인스턴스 생성
const baseConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
};

const authApi = axios.create({
  ...baseConfig,
  timeout: 10000,
});

const instance: AxiosInstance = axios.create(baseConfig);

// 토큰 관리
export const setTokens = (newAccess: string, newRefresh: string) => {
  accessToken = newAccess;
  refreshToken = newRefresh;
  setStoredRefreshToken(newRefresh);
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
  removeStoredRefreshToken();
};

// 요청 인터셉터
instance.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 아니거나 이미 재시도한 요청이면 그대로 reject
    if (error.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    // refresh 중이면 큐에 대기
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return instance(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      if (!refreshToken) {
        throw new Error("No refresh token");
      }

      const { data } = await authApi.post("/auth/refresh", {
        refreshToken,
      });

      const newAccess: string = data.accessToken;
      const newRefresh: string = data.refreshToken;

      setTokens(newAccess, newRefresh);

      processQueue(null, newAccess);

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${newAccess}`;

      return instance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      clearTokens();
      dispatchLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default instance;
