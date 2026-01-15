import { Sidebar } from "@/components/layouts/sidebar";
import { UserNav } from "@/components/layouts/user-nav";
import { NotificationsNav } from "@/components/layouts/notifications-nav"; 

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
        <Sidebar />
      </div>
      <main className="md:pl-72 pb-10">
        <div className="flex items-center justify-end p-4 border-b h-16 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
          {/* Cụm Header bên phải */}
          <div className="flex items-center gap-3">
             
             {/* Nút chuông thông báo (Đứng riêng) */}
             <NotificationsNav />

             <div className="h-6 w-px bg-gray-200 mx-1" /> {/* Đường kẻ dọc ngăn cách */}

             <div className="flex flex-col items-end mr-1">
                <span className="text-sm font-semibold text-gray-700">Nguyễn Văn A</span>
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Admin</span>
             </div>
             
             {/* Avatar User */}
             <UserNav /> 
          </div>
        </div>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}