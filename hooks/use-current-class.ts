// hooks/use-current-class.ts
"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

const sanitizeClassId = (value: string | null): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();
  // Accept common id formats (ObjectId / UUID-like / slug id)
  if (!/^[A-Za-z0-9_-]{6,64}$/.test(trimmed)) return undefined;
  return trimmed;
};

export const useCurrentClass = () => {
  const searchParams = useSearchParams();
  const classId = sanitizeClassId(searchParams.get("classId"));

  return useMemo(
    () => ({
      classId,
      createLink: (path: string) => {
        if (!classId) return path;
        const [basePath, queryString = ""] = path.split("?");
        const params = new URLSearchParams(queryString);
        params.set("classId", classId);
        return `${basePath}?${params.toString()}`;
      },
    }),
    [classId],
  );
};
