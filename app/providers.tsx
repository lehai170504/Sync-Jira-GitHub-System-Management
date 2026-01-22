"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "@/lib/get-query-client";
import type * as React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Lấy queryClient (đảm bảo singleton ở client)
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Devtools chỉ hiện khi ở môi trường dev */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
