import instance from "./axiosInstance";

interface LoginPayload {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  role: string;
}

function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

function clearTokens(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("lastReissueTime");
}

export const loginUser = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  const response = await instance.post<LoginResponse>("/main/login", payload);
  const { accessToken, refreshToken, role } = response.data;
  localStorage.setItem("role", role);
  setTokens(accessToken, refreshToken);

  return response.data;
};

export const logoutUser = (): void => {
  clearTokens();
  localStorage.removeItem("role");
};
