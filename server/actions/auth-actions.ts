"use server";

import { loginSchema } from "@/lib/validations/auth.schema";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  // 1. Giả lập delay mạng
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const rawData = Object.fromEntries(formData.entries());
  const validated = loginSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: "Dữ liệu không hợp lệ!" };
  }

  // 2. Logic thật: Gọi DB check user -> Tạo session
  const { email } = validated.data;

  if (!email.endsWith("@fpt.edu.vn") && !email.endsWith("@fe.edu.vn")) {
    return { error: "Vui lòng sử dụng mail @fpt.edu.vn hoặc @fe.edu.vn" };
  }

  // 3. Redirect sau khi thành công
  redirect("/dashboard");
}
