import { NextResponse } from "next/server";
import { serverRequest } from "@/lib/axios-server";

export async function GET(
  _req: Request,
  { params }: { params: { teamId: string } },
) {
  try {
    const data = await serverRequest("GET", `/reviews/team/${params.teamId}`);
    return NextResponse.json(data);
  } catch (error: any) {
    const status = error?.response?.status ?? 500;
    const payload =
      error?.response?.data ??
      error?.message ?? { error: "Không thể tải dữ liệu đánh giá nhóm." };

    return NextResponse.json(payload, { status });
  }
}

