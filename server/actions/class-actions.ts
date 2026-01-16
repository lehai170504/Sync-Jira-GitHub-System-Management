"use server";

export async function importClassData(data: any[]) {
  // Giả lập delay mạng
  await new Promise((resolve) => setTimeout(resolve, 1500));

  console.log("Receiving Data for Import:", data);

  // Logic thực tế:
  // 1. Dùng Prisma createMany cho Student
  // 2. Link Student với Class (Dựa vào cột Class Code)

  if (data.length === 0) {
    return { error: "Không có dữ liệu để nhập." };
  }

  return {
    success: true,
    message: `Đã nhập thành công ${data.length} sinh viên vào hệ thống.`,
  };
}
