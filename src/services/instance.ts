import axios from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

let accessToken: string | null = null;
let refreshToken: string | null = null;

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

const getRefreshToken = (): string | null => {
  const stored = getStoredRefreshToken();

  if (stored !== refreshToken) {
    refreshToken = stored;
  }

  return refreshToken;
};

let isRefreshing = false;

let failedQueue: Array<{
  resolve: (value: AxiosResponse) => void;
  reject: (err: unknown) => void;
  originalRequest: InternalAxiosRequestConfig;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject, originalRequest }) => {
    if (error) {
      reject(error);
    } else {
      originalRequest.headers.Authorization = `Bearer ${token!}`;
      instance(originalRequest).then(resolve).catch(reject);
    }
  });
  failedQueue = [];
};

const dispatchLogout = () => {
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

const baseConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
};

export const authApi = axios.create({
  ...baseConfig,
  timeout: 10000,
});

const instance: AxiosInstance = axios.create(baseConfig);

export const setTokens = (newAccess: string, newRefresh: string) => {
  accessToken = newAccess;
  refreshToken = newRefresh;

  try {
    localStorage.setItem("accessToken", newAccess);
  } catch {
    console.warn("localStorage 저장 실패");
  }
  setStoredRefreshToken(newRefresh);
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
  try {
    localStorage.removeItem("accessToken");
  } catch {
    console.warn("localStorage 삭제 실패");
  }
  removeStoredRefreshToken();
};

instance.interceptors.request.use(
  (config) => {
    const storedToken = localStorage.getItem("accessToken");
    const token = storedToken || accessToken;

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      (error.response?.status !== 401 && error.response?.status !== 403) ||
      originalRequest?._retry ||
      originalRequest?.url === "/main/login"
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        failedQueue.push({ resolve, reject, originalRequest });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const token = getRefreshToken();

      if (!token) {
        throw new Error("No refresh token");
      }

      const { data } = await authApi.post("/main/refresh", {
        refreshToken: token,
      });

      if (!data.accessToken || !data.refreshToken) {
        throw new Error("Invalid refresh response");
      }

      const newAccess: string = data.accessToken;
      const newRefresh: string = data.refreshToken;

      setTokens(newAccess, newRefresh);

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${newAccess}`;

      const result = instance(originalRequest);

      processQueue(null, newAccess);

      return result;
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

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "accessToken" && !event.newValue) {
      accessToken = null;
      dispatchLogout();
    }
  });
}

export default instance;
