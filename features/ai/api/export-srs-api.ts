import { axiosClient } from "@/lib/axios-client";

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

export async function exportSrsMarkdownApi(projectId: string) {
  const res = await axiosClient.get<Blob>(
    `/ai/project/${encodeURIComponent(projectId)}/export-srs`,
    { responseType: "blob" },
  );

  const contentDisposition =
    (res.headers?.["content-disposition"] as string | undefined) ??
    (res.headers?.["Content-Disposition"] as string | undefined);

  const filename = getFilenameFromContentDisposition(contentDisposition);
  return { blob: res.data, filename };
}

