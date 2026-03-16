import axios from "axios";
import type { AxiosInstance } from "axios";

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 쿠키에서 특정 값 가져오는 헬퍼 함수
const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
};

// 요청 인터셉터 - 모든 요청에 Access Token 자동 첨부
instance.interceptors.request.use(
  (config) => {
    const accessToken = getCookie("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

// 응답 인터셉터 - 401 발생 시 Refresh Token으로 자동 갱신
instance.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };

    // 401이고 재시도 안 한 요청만 갱신 시도
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getCookie("refreshToken");
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          { refreshToken },
        );

        // 새 Access Token 쿠키에 저장
        document.cookie = `accessToken=${data.accessToken}; path=/; max-age=3600; Secure; SameSite=Strict`;

        // 실패했던 요청 재시도
        if (originalRequest?.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }
        return instance(originalRequest!);
      } catch (refreshError: unknown) {
        // Refresh Token도 만료 → 강제 로그아웃
        document.cookie = "accessToken=; path=/; max-age=0";
        document.cookie = "refreshToken=; path=/; max-age=0";
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default instance;