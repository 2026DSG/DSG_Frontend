import axios from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// 토큰 저장소
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

// 항상 최신 refreshToken 보장
const getRefreshToken = (): string | null => {
  const stored = getStoredRefreshToken();

  if (stored !== refreshToken) {
    refreshToken = stored;
  }

  return refreshToken;
};

// 동시 요청 처리
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

// 로그아웃 이벤트
const dispatchLogout = () => {
  window.location.href = "/login";
};

// axios 인스턴스 생성
const baseConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
};

// refresh 전용 인스턴스
export const authApi = axios.create({
  ...baseConfig,
  timeout: 10000,
});

// 일반 API
const instance: AxiosInstance = axios.create(baseConfig);

// 토큰 관리
export const setTokens = (newAccess: string, newRefresh: string) => {
  console.log("setTokens 호출됨", newAccess);
  accessToken = newAccess;
  refreshToken = newRefresh;

  // localStorage에 accessToken도 저장
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

// 요청 인터셉터
instance.interceptors.request.use(
  (config) => {
    // 메모리가 아닌 localStorage에서 항상 최신값을 읽음
    const storedToken = localStorage.getItem("accessToken");
    const token = storedToken || accessToken;

    console.log("요청 시 accessToken:", token);
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
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

    if (
      (error.response?.status !== 401 && error.response?.status !== 403) ||
      originalRequest?._retry
    ) {
      return Promise.reject(error);
    }

    // 이미 refresh 중이면 큐에 대기
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
