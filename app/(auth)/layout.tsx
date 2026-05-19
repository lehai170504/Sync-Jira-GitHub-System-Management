import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xác thực | SAG-CA Platform",
  description: "Truy cập vào hệ thống đánh giá liên tục dựa trên đồ thị hoạt động.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-[100dvh] w-full bg-slate-50 dark:bg-zinc-950 transition-colors duration-500 flex items-center justify-center">
      {children}
    </main>
  );
}
