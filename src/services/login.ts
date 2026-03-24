import instance, { setTokens, clearTokens } from "./instance";

interface LoginPayload {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const loginUser = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  const response = await instance.post<LoginResponse>("/main/login", payload);
  const { accessToken, refreshToken } = response.data;

  setTokens(accessToken, refreshToken);

  return response.data;
};

export const logoutUser = (): void => {
  clearTokens();
};
