import instance from "./instance";

interface LoginPayload {
  id: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const loginUser = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  try {
    const response = await instance.post<LoginResponse>("/login", payload);
    const { accessToken, refreshToken } = response.data;

    document.cookie = `accessToken=${accessToken}; path=/; Secure; SameSite=Strict`;
    document.cookie = `refreshToken=${refreshToken}; path=/; Secure; SameSite=Strict`;

    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Login Error:", err.message);
    }
    throw err;
  }
};

export const logoutUser = (): void => {
  document.cookie = "accessToken=; path=/; max-age=0";
  document.cookie = "refreshToken=; path=/; max-age=0";
};
