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
import { ThemeProvider } from "@/components/providers/theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {/* FIX: Tách RoleGuard ra đứng 1 mình trong Suspense.
          Như vậy chỉ có mình nó bị ảnh hưởng bởi useSearchParams,
          còn toàn bộ {children} ở dưới vẫn giữ được SSR/SSG! */}
      <Suspense fallback={null}>
        <RoleGuard />
      </Suspense>

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

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
