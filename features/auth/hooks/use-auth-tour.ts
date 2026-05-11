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
          element: "#auth-info-panel",
          popover: {
            title: "🚀 Trung tâm thông tin",
            description:
              "Nơi hiển thị trạng thái hệ thống và các thông tin quan trọng về hành trình của bạn.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#auth-form-container",
          popover: {
            title: isRegisterMode
              ? "📝 Đăng ký thành viên"
              : "🔐 Xác thực danh tính",
            description: isRegisterMode
              ? "Điền thông tin để khởi tạo hồ sơ sinh viên chuyên nghiệp trên hệ thống."
              : "Sử dụng tài khoản đã được cấp để truy cập vào không gian làm việc đồng bộ.",
            side: "left",
            align: "center",
          },
        },
        {
          element: "#auth-help-button",
          popover: {
            title: "💡 Hỗ trợ 24/7",
            description:
              "Bất cứ khi nào bạn gặp khó khăn, hãy nhấn vào đây để được hướng dẫn chi tiết.",
            side: "bottom",
            align: "center",
          },
        },
      ],
    });

    driverObj.drive();
  };

  return { startTour };
};
