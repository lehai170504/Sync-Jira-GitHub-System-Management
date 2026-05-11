import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const useStudentTour = () => {
  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      stagePadding: 8,
      doneBtnText: "Đã hiểu",
      nextBtnText: "Tiếp theo",
      prevBtnText: "Lùi lại",
      popoverClass: "sync-driver-popover",
      steps: [
        {
          element: "#student-board-header",
          popover: {
            title: "Bảng theo dõi tiến độ",
            description: "Tại đây bạn có thể xem tổng quan về tình trạng công việc của nhóm.",
            side: "bottom",
          },
        },
        {
          element: "#sync-status-indicator",
          popover: {
            title: "Trạng thái đồng bộ",
            description: "Bạn có thể kiểm tra xem hệ thống đã lấy dữ liệu mới nhất từ Jira/Github hay chưa thông qua các nhãn này.",
            side: "bottom",
          },
        },
        {
          element: "#kanban-view-tab",
          popover: {
            title: "Chế độ xem Kanban",
            description: "Kéo thả và quản lý trực quan các công việc (Task) tương tự như trên Jira.",
            side: "top",
          },
        },
        {
          element: "#member-view-tab",
          popover: {
            title: "Theo dõi theo thành viên",
            description: "Chuyển sang tab này để xem chi tiết từng thành viên đang làm task nào, và đã hoàn thành bao nhiêu task.",
            side: "top",
          },
        },
      ],
    });

    driverObj.drive();
  };

  return { startTour };
};
