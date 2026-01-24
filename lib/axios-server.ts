import axios from "axios";
import { cookies } from "next/headers";

// Hàm helper để gọi API từ Server Component
export const serverRequest = async (
  method: "GET" | "POST",
  url: string,
  data?: any,
) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await axios({
    method,
    url: `${process.env.NEXT_PUBLIC_API_URL}${url}`,
    data,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
  return res.data;
};
