import { NextResponse } from "next/server";
import { serverRequest } from "@/lib/axios-server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    // 1. Dùng await để "mở hộp" params và lấy teamId ra
    const { teamId } = await params;

    // 2. Truyền thẳng biến teamId vào url
    const data = await serverRequest("GET", `/reviews/team/${teamId}`);

    return NextResponse.json(data);
  } catch (error: any) {
    const status = error?.response?.status ?? 500;
    const payload = error?.response?.data ??
      error?.message ?? { error: "Không thể tải dữ liệu đánh giá nhóm." };

    return NextResponse.json(payload, { status });
  }
}
