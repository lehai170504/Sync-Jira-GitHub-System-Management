import axios from "axios";

// Định nghĩa response trả về từ API refresh (dựa theo LoginResponse cũ)
interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

export const refreshTokenApi = async (refreshToken: string) => {
  const { data } = await axios.post<RefreshTokenResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
    {
      refresh_token: refreshToken,
    },
  );
  return data;
};
