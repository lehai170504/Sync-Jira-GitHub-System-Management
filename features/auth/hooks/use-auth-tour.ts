import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const useAuthTour = (isRegisterMode: boolean) => {
  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      stagePadding: 8, // Tăng padding highlight

      // Text Tiếng Việt thân thiện
      doneBtnText: "Bắt đầu ngay 🚀",
      nextBtnText: "Tiếp theo →",
      prevBtnText: "← Quay lại",

      // Class tùy chỉnh (đã style ở globals.css)
      popoverClass: "sync-driver-popover",

      steps: [
        {
          element: "#auth-logo-area",
          popover: {
            title: "Chào mừng đến với SyncSystem",
            description:
              "Nền tảng quản lý dự án & học tập tích hợp GitHub và Jira dành riêng cho bạn.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#auth-form-area",
          popover: {
            title: isRegisterMode
              ? "📝 Đăng ký tài khoản"
              : "🔐 Đăng nhập hệ thống",
            description: isRegisterMode
              ? "Điền thông tin cá nhân để tạo tài khoản mới và bắt đầu hành trình."
              : "Nhập Email và Mật khẩu đã đăng ký để truy cập vào không gian làm việc của bạn.",
            side: "right",
            align: "center",
          },
        },
        {
          element: "#auth-banner-section",
          popover: {
            title: "🔄 Chuyển đổi chế độ",
            description:
              "Bạn có thể dễ dàng chuyển đổi giữa Đăng nhập và Đăng ký tại khu vực này.",
            side: "left",
            align: "center",
          },
        },
      ],
    });

    driverObj.drive();
  };

  return { startTour };
};
