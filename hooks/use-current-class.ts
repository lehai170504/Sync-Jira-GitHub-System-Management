// hooks/use-current-class.ts
"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export const useCurrentClass = () => {
  const searchParams = useSearchParams();
  const classId = searchParams.get("classId");

  return useMemo(
    () => ({
      classId: classId || undefined,
      createLink: (path: string) =>
        classId ? `${path}?classId=${classId}` : path,
    }),
    [classId],
  );
};
