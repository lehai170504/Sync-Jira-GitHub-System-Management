// "use client";

// import { useState } from "react";
// import {
//   Save,
//   RefreshCw,
//   Github,
//   Trello, // Icon đại diện cho Jira
//   AlertTriangle,
//   CheckCircle2,
//   Lock,
//   Globe,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import { Slider } from "@/components/ui/slider";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { Badge } from "@/components/ui/badge";
// import { toast } from "sonner"; // Giả sử bạn dùng thư viện toast này, hoặc dùng alert

// export function ClassSettings() {
//   const [loading, setLoading] = useState(false);

//   // Mock state cho cấu hình
//   const [weights, setWeights] = useState({
//     process: 40, // Điểm quá trình (Jira)
//     product: 40, // Điểm sản phẩm (Code/GitHub)
//     softSkill: 20, // Điểm kỹ năng mềm/Báo cáo
//   });

//   const handleSave = () => {
//     setLoading(true);
//     // Giả lập call API
//     setTimeout(() => {
//       setLoading(false);
//       toast.success("Đã lưu cấu hình lớp học thành công!");
//     }, 1500);
//   };

//   return (
//     <div className="grid gap-6 md:grid-cols-2">
//       {/* 1. CẤU HÌNH TÍCH HỢP (JIRA & GITHUB) */}
//       <div className="space-y-6">
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Globe className="h-5 w-5 text-blue-500" /> Kết nối Hệ thống
//             </CardTitle>
//             <CardDescription>
//               Cấu hình API để đồng bộ dữ liệu tự động
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             {/* GitHub Config */}
//             <div className="space-y-4 border p-4 rounded-lg bg-gray-50/50">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2 font-semibold">
//                   <Github className="h-5 w-5" /> GitHub Classroom / Organization
//                 </div>
//                 <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
//                   Đã kết nối
//                 </Badge>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="gh-org">Organization Name</Label>
//                 <Input
//                   id="gh-org"
//                   defaultValue="fpt-swp391-spring2026"
//                   placeholder="VD: fpt-university-hcm"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="gh-token">Personal Access Token (PAT)</Label>
//                 <div className="relative">
//                   <Input
//                     id="gh-token"
//                     type="password"
//                     defaultValue="ghp_xxxxxxxxxxxx"
//                   />
//                   <Lock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
//                 </div>
//                 <p className="text-[10px] text-muted-foreground">
//                   Token cần quyền: repo, read:org, read:user
//                 </p>
//               </div>
//             </div>

//             {/* Jira Config */}
//             <div className="space-y-4 border p-4 rounded-lg bg-gray-50/50">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2 font-semibold">
//                   <Trello className="h-5 w-5 text-blue-600" /> Jira Software
//                 </div>
//                 <Badge
//                   variant="outline"
//                   className="text-yellow-600 border-yellow-200 bg-yellow-50"
//                 >
//                   Chưa đồng bộ
//                 </Badge>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="jira-domain">Jira Domain</Label>
//                 <Input
//                   id="jira-domain"
//                   placeholder="https://your-domain.atlassian.net"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="jira-email">Admin Email</Label>
//                 <Input id="jira-email" placeholder="admin@fpt.edu.vn" />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="jira-token">API Token</Label>
//                 <Input
//                   id="jira-token"
//                   type="password"
//                   placeholder="••••••••••••••••"
//                 />
//               </div>
//             </div>
//           </CardContent>
//           <CardFooter className="justify-between bg-gray-50 border-t p-4">
//             <Button variant="ghost" size="sm" className="text-muted-foreground">
//               Kiểm tra kết nối
//             </Button>
//             <Button
//               onClick={handleSave}
//               disabled={loading}
//               className="bg-[#F27124] hover:bg-[#d65d1b]"
//             >
//               {loading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
//               Lưu & Đồng bộ
//             </Button>
//           </CardFooter>
//         </Card>
//       </div>

//       {/* 2. CẤU HÌNH ĐÁNH GIÁ (GRADING RULES) */}
//       <div className="space-y-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Tiêu chí Đánh giá</CardTitle>
//             <CardDescription>
//               Thiết lập trọng số tính điểm tự động (AI Suggestion)
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             {/* Sliders */}
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <Label>Tiến độ Scrum (Jira)</Label>
//                 <span className="font-bold text-[#F27124]">
//                   {weights.process}%
//                 </span>
//               </div>
//               <Slider
//                 value={[weights.process]}
//                 max={100}
//                 step={5}
//                 onValueChange={(v) => setWeights({ ...weights, process: v[0] })}
//                 className="py-2"
//               />
//               <p className="text-xs text-muted-foreground">
//                 Dựa trên: Story Points hoàn thành, Thời gian Log-work, Đúng hạn.
//               </p>
//             </div>

//             <Separator />

//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <Label>Chất lượng Code (GitHub)</Label>
//                 <span className="font-bold text-blue-600">
//                   {weights.product}%
//                 </span>
//               </div>
//               <Slider
//                 value={[weights.product]}
//                 max={100}
//                 step={5}
//                 onValueChange={(v) => setWeights({ ...weights, product: v[0] })}
//                 className="py-2"
//               />
//               <p className="text-xs text-muted-foreground">
//                 Dựa trên: Số Commits, Lines of Code, Pull Request Merged.
//               </p>
//             </div>

//             <Separator />

//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <Label>Kỹ năng mềm / Báo cáo</Label>
//                 <span className="font-bold text-green-600">
//                   {weights.softSkill}%
//                 </span>
//               </div>
//               <Slider
//                 value={[weights.softSkill]}
//                 max={100}
//                 step={5}
//                 onValueChange={(v) =>
//                   setWeights({ ...weights, softSkill: v[0] })
//                 }
//                 className="py-2"
//               />
//               <p className="text-xs text-muted-foreground">
//                 Dựa trên: Điểm danh, Peer Review (Đánh giá chéo).
//               </p>
//             </div>
//           </CardContent>
//         </Card>

//         {/* 3. CẢNH BÁO TỰ ĐỘNG */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <AlertTriangle className="h-5 w-5 text-yellow-500" /> Ngưỡng Cảnh
//               báo (Risk Alert)
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div className="space-y-0.5">
//                 <Label className="text-base">Không hoạt động (Inactive)</Label>
//                 <p className="text-xs text-muted-foreground">
//                   Cảnh báo khi SV không có commit trong X ngày
//                 </p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Input type="number" className="w-16 h-8" defaultValue={3} />
//                 <span className="text-sm">ngày</span>
//               </div>
//             </div>

//             <Separator />

//             <div className="flex items-center justify-between">
//               <div className="space-y-0.5">
//                 <Label className="text-base">Spam Commits</Label>
//                 <p className="text-xs text-muted-foreground">
//                   Cảnh báo khi commit quá nhiều trong thời gian ngắn
//                 </p>
//               </div>
//               <Switch checked={true} />
//             </div>

//             <Separator />

//             <div className="flex items-center justify-between">
//               <div className="space-y-0.5">
//                 <Label className="text-base">Thiếu liên kết Task</Label>
//                 <p className="text-xs text-muted-foreground">
//                   Commit không chứa mã Jira Ticket (VD: SWP-123)
//                 </p>
//               </div>
//               <Switch checked={true} />
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
