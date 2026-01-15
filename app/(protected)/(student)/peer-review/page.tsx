import { ReviewCard } from "@/components/features/review/review-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock, Info } from "lucide-react";

// --- MOCK DATA (Thay bằng API call lấy thành viên nhóm) ---
const mockTeamMembers = [
  {
    id: "mem1",
    name: "Trần Văn Backend",
    role: "Backend Developer",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  },
  {
    id: "mem2",
    name: "Lê Thị Tester",
    role: "Quality Assurance",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  },
  {
    id: "mem3",
    name: "Nguyễn AI Engineer",
    role: "Data Scientist",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
];

export default function PeerReviewPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Đánh giá thành viên Sprint 4
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Đánh giá công bằng dựa trên sự đóng góp thực tế. Kết quả đánh giá sẽ
          ảnh hưởng 30% đến điểm số cá nhân của thành viên.
        </p>
      </div>

      {/* Info Alerts */}
      <div className="grid gap-4 md:grid-cols-2 max-w-4xl mx-auto">
        <Alert className="bg-blue-50 text-blue-800 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle>Bảo mật thông tin</AlertTitle>
          <AlertDescription>
            Mọi đánh giá đều được ẩn danh với thành viên khác. Chỉ Giảng viên
            mới xem được chi tiết.
          </AlertDescription>
        </Alert>

        <Alert className="bg-orange-50 text-orange-800 border-orange-200">
          <Clock className="h-4 w-4 text-orange-600" />
          <AlertTitle>Thời hạn đóng form</AlertTitle>
          <AlertDescription>
            Form sẽ tự động khóa vào <b>23:59 ngày 20/10/2025</b>. Vui lòng hoàn
            thành sớm.
          </AlertDescription>
        </Alert>
      </div>

      {/* Grid Review Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockTeamMembers.map((member) => (
          <div key={member.id} className="h-full">
            <ReviewCard member={member} />
          </div>
        ))}
      </div>
    </div>
  );
}
