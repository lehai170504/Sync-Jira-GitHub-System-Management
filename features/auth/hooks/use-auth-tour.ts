import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const useAuthTour = (isRegisterMode: boolean) => {
  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      stagePadding: 10,
      stageRadius: 24,

      doneBtnText: "Hoàn tất",
      nextBtnText: "Tiếp theo",
      prevBtnText: "Quay lại",

      popoverClass: "auth-driver-popover",

      steps: [
        {
          element: "#auth-info-panel",
          popover: {
            title: "Khu vực giới thiệu",
            description:
              "Hiển thị thông tin tổng quan về GraphGrade, lợi ích chính và nhận diện thương hiệu của hệ thống.",
            side: "right",
            align: "center",
          },
        },
        {
          element: "#auth-form-container",
          popover: {
            title: isRegisterMode ? "Biểu mẫu đăng ký" : "Biểu mẫu đăng nhập",
            description: isRegisterMode
              ? "Nhập email để nhận mã OTP, sau đó hoàn tất thông tin tài khoản để bắt đầu sử dụng hệ thống."
              : "Nhập email và mật khẩu để truy cập tài khoản. Bạn cũng có thể đăng nhập bằng Google Workspace.",
            side: "left",
            align: "center",
          },
        },
        {
          element: "#auth-help-button",
          popover: {
            title: "Nút hướng dẫn",
            description:
              "Mở lại phần hướng dẫn sử dụng bất cứ lúc nào khi bạn cần xem nhanh các khu vực chính trên trang.",
            side: "bottom",
            align: "end",
          },
        },
      ],
    });

    driverObj.drive();
  };

  return { startTour };
};