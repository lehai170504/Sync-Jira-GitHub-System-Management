import { axiosClient } from "@/lib/axios-client";
import * as XLSX from "xlsx";

function getFilenameFromContentDisposition(headerValue?: string | null) {
  if (!headerValue) return null;
  const mStar = headerValue.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
  if (mStar?.[1]) {
    try {
      return decodeURIComponent(mStar[1].replace(/(^")|("$)/g, ""));
    } catch {
      return mStar[1];
    }
  }

  const m = headerValue.match(/filename\s*=\s*("?)([^"]+)\1/i);
  return m?.[2] ?? null;
}

interface ClassGradesItem {
  student?: {
    student_code?: string;
    full_name?: string;
  };
  team?: {
    project_name?: string;
  };
  role_in_team?: string;
  grades?: Array<{
    group_grade?: number;
    contribution_factor?: number;
    final_score?: number;
  }>;
}

interface ClassGradesResponse {
  message?: string;
  class_id?: string;
  total_students?: number;
  data?: ClassGradesItem[];
}

function sanitizeFileName(input: string) {
  return input
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "-")
    .replace(/\s+/g, " ")
    .slice(0, 120);
}

/**
 * GET /reviews/classes/{classId}/grades (JSON)
 * FE convert JSON -> Excel (.xlsx) rồi tải xuống.
 */
export async function exportClassGradesExcelApi(
  classId: string,
  className?: string,
) {
  const { data, headers } = await axiosClient.get<ClassGradesResponse>(
    `/reviews/classes/${encodeURIComponent(classId)}/grades`,
  );

  const rows = (data?.data ?? []).flatMap((item, idx) => {
    const base = {
      STT: idx + 1,
      "MSSV": item.student?.student_code ?? "",
      "Họ tên": item.student?.full_name ?? "",
      "Nhóm": item.team?.project_name ?? "",
      "Vai trò": item.role_in_team ?? "",
    };

    const grades = Array.isArray(item.grades) ? item.grades : [];
    if (grades.length === 0) {
      return [
        {
          ...base,
          "Điểm nhóm": "",
          "Hệ số đóng góp": "",
          "Điểm cuối cùng": "",
        },
      ];
    }

    return grades.map((g) => ({
      ...base,
      "Điểm nhóm": g.group_grade ?? "",
      "Hệ số đóng góp": g.contribution_factor ?? "",
      "Điểm cuối cùng": g.final_score ?? "",
    }));
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "ClassGrades");
  const arrayBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([arrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const contentDisposition =
    (headers?.["content-disposition"] as string | undefined) ??
    (headers?.["Content-Disposition"] as string | undefined);
  const classNameFilename = className ? `${sanitizeFileName(className)}.xlsx` : null;
  const filename = classNameFilename || "bang-diem-lop.xlsx";

  return { blob, filename };
}

