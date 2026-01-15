# SyncSystem 🚀

![SyncSystem Banner](https://via.placeholder.com/1200x300/F27124/FFFFFF?text=SyncSystem+-+FPT+Project+Management+Platform)

> **Hệ thống Quản lý và Đồng bộ Dữ liệu Đồ án Tốt nghiệp & Thực tập.**
> Tự động hóa việc theo dõi tiến độ, tính điểm và đánh giá sinh viên dựa trên dữ liệu thực từ Jira và GitHub.

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Shadcn/UI](https://img.shields.io/badge/Shadcn%2FUI-Components-000000?style=for-the-badge&logo=shadcnui)](https://ui.shadcn.com/)

---

## 🌟 Tính năng nổi bật

Hệ thống được thiết kế tối ưu cho giảng viên và quản lý dự án tại FPT University:

- **📊 Smart Dashboard:** Tổng quan sức khỏe dự án, biểu đồ Burndown, thống kê Task/Commit theo thời gian thực (Real-time).
- **🔗 Auto Mapping (Định danh):** Tự động ghép nối sinh viên với tài khoản Jira/GitHub thông qua Email và AI matching.
- **📈 Automated Scoring:** Tính điểm tự động dựa trên trọng số tùy chỉnh (Ví dụ: 40% Jira, 40% Git, 20% Review).
- **⚙️ Cấu hình linh hoạt:** Quản lý kết nối API tới Jira/GitHub, thiết lập Deadline, quy tắc tính điểm.
- **📑 Báo cáo chuyên nghiệp:** Xuất dữ liệu ra Excel (.xlsx) chuẩn format nhà trường chỉ với 1 cú click.
- **🔔 Thông báo thông minh:** Cảnh báo rủi ro (Risk Alert) khi sinh viên trễ hạn hoặc thiếu commit.

## 🛠️ Công nghệ sử dụng (Tech Stack)

| Lĩnh vực | Công nghệ |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4, Shadcn/UI (Theme FPT Orange) |
| **Charts** | Recharts (Biểu đồ tương tác) |
| **Icons** | Lucide React |
| **Forms** | React Hook Form + Zod Validation |
| **Utils** | ExcelJS (Export file), Sonner (Toast notifications) |

## 🚀 Cài đặt và Chạy dự án

Đảm bảo máy bạn đã cài đặt [Node.js](https://nodejs.org/) (phiên bản 18+).

### 1. Clone dự án
```bash
git clone [https://github.com/your-username/sync-system.git](https://github.com/your-username/sync-system.git)
cd sync-system
