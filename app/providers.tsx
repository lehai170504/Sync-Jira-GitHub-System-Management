"use client";

import { Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "@/lib/get-query-client";
import { SocketProvider } from "@/components/providers/socket-provider";
import { FCMTokenProvider } from "@/components/providers/fcm-token-provider";
import { RoleGuard } from "@/components/providers/role-guard";
import { WebhookOAuthRelinkAlert } from "@/features/auth/components/webhook-oauth-relink-alert";
import { MissingIntegrationsAlert } from "@/features/auth/components/missing-integrations-alert";
import { AiChatWidget } from "@/features/ai/components/ai-chat-widget";

// 1. Import ThemeProvider (đã tạo ở bước trước)
import { ThemeProvider } from "@/components/providers/theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={null}>
        <RoleGuard>
        {/* 2. Bọc ThemeProvider vào đây. 
          Nó nên nằm trong QueryClient (để dùng được state nếu cần) 
          nhưng bọc ngoài các Provider logic khác. */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WebhookOAuthRelinkAlert />
          <MissingIntegrationsAlert />
          <AiChatWidget />
          <SocketProvider>
            <FCMTokenProvider>{children}</FCMTokenProvider>
          </SocketProvider>
        </ThemeProvider>
        </RoleGuard>
      </Suspense>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
