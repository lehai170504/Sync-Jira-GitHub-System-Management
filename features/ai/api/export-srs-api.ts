import { axiosClient } from "@/lib/axios-client";

function getFilenameFromContentDisposition(headerValue?: string | null) {
  if (!headerValue) return null;
  // Handles:
  // - attachment; filename="file.md"
  // - attachment; filename*=UTF-8''file%20name.md
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

export async function exportSrsMarkdownApi(projectId: string) {
  const baseUrl = String(axiosClient.defaults.baseURL ?? "");
  const baseEndsWithApi = /\/api\/?$/i.test(baseUrl);

  const pathNoApi = `/ai/project/${encodeURIComponent(projectId)}/export-srs`;
  const pathWithApi = `/api/ai/project/${encodeURIComponent(projectId)}/export-srs`;

  // Ưu tiên "/ai/..." để tránh double "/api/api" khi baseURL đã chứa "/api".
  // Giữ fallback "/api/ai/..." cho môi trường không có prefix.
  let res:
    | Awaited<ReturnType<typeof axiosClient.get<Blob>>>
    | undefined;
  try {
    res = await axiosClient.get<Blob>(pathNoApi, { responseType: "blob" });
  } catch (e: any) {
    const status = e?.response?.status;
    if (status !== 404) throw e;
    if (baseEndsWithApi) throw e;
    res = await axiosClient.get<Blob>(pathWithApi, { responseType: "blob" });
  }

  const contentDisposition =
    (res.headers?.["content-disposition"] as string | undefined) ??
    (res.headers?.["Content-Disposition"] as string | undefined);

  const filename = getFilenameFromContentDisposition(contentDisposition);
  return { blob: res.data, filename };
}

