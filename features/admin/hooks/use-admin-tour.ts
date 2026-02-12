import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const useAdminTour = () => {
  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      stagePadding: 8,
      doneBtnText: "Hoàn tất",
      nextBtnText: "Tiếp theo",
      prevBtnText: "Lùi lại",
      popoverClass: "sync-driver-popover", // Class CSS custom ở globals.css
      steps: [
        {
          element: "#dashboard-header",
          popover: {
            title: "Trung tâm điều khiển",
            description:
              "Tổng quan sức khỏe hệ thống và các công cụ quản trị nhanh.",
            side: "bottom",
          },
        },
        {
          element: "#metrics-grid",
          popover: {
            title: "Chỉ số trọng yếu (KPI)",
            description:
              "Theo dõi biến động người dùng, dự án và tài nguyên theo thời gian thực.",
            side: "bottom",
          },
        },
        {
          element: "#revenue-chart",
          popover: {
            title: "Biểu đồ truy cập",
            description:
              "Phân tích xu hướng truy cập hệ thống trong 7 ngày qua.",
            side: "top",
          },
        },
        {
          element: "#recent-users",
          popover: {
            title: "Người dùng mới",
            description:
              "Quản lý danh sách sinh viên và giảng viên vừa tham gia hệ thống.",
            side: "top",
          },
        },
      ],
    });

    driverObj.drive();
  };

  return { startTour };
};
