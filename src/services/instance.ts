import axios from "axios";

const plainAxios = axios.create();

let isReissuing = false;

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(
  name: string,
  value: string | number,
  days: number = 365,
): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(
    value,
  )};expires=${expires.toUTCString()};path=/`;
}

export async function reissueAccessToken(): Promise<void> {
  if (isReissuing) return;
  isReissuing = true;

  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    console.error("[토큰 재발급 실패] refreshToken 없음.");
    isReissuing = false;
    localStorage.removeItem("accessToken");
    throw new Error("NO_REFRESH_TOKEN");
  }

  try {
    const response = await plainAxios.post(
      `${import.meta.env.VITE_API_BASE_URL}/main/refresh`,
      { refreshToken },
      { headers: { "Content-Type": "application/json" } },
    );

    const data = response.data;

    if (!data?.accessToken || !data?.refreshToken) {
      console.error(
        "[토큰 재발급 실패] 응답 데이터가 올바르지 않습니다:",
        data,
      );
      throw new Error("INVALID_TOKEN_RESPONSE");
    }

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    let accessTokenNumber = parseInt(getCookie("accessTokenNumber") ?? "0", 10);
    accessTokenNumber += 1;
    setCookie("accessTokenNumber", accessTokenNumber);

    console.log(
      `[토큰 재발급 성공] accessTokenNumber=${accessTokenNumber}, 시간=${new Date().toLocaleString()}`,
    );
  } catch (err) {
    console.error("[토큰 재발급 실패] 알 수 없는 오류:", err);
    localStorage.removeItem("refreshToken");
    throw err;
  } finally {
    isReissuing = false;
  }
}
