// Đây là nơi chứa logic gọi API Jira Software
export const JiraService = {
  async syncIssues(projectId: string) {
    console.log(`[JiraService] Đang lấy task từ Project: ${projectId}...`);

    // GIẢ LẬP: Gọi API Jira (Mất 2 giây)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // GIẢ LẬP: Kết quả trả về từ API
    const mockIssues = [
      { key: "PRJ-1", summary: "Design Database", points: 5, status: "Done" },
      { key: "PRJ-2", summary: "Setup Next.js", points: 3, status: "Done" },
      {
        key: "PRJ-3",
        summary: "Create Login API",
        points: 8,
        status: "In Progress",
      },
    ];

    return {
      success: true,
      totalIssues: mockIssues.length,
      newIssues: 1, // Giả sử có 1 cái mới
      updatedIssues: 2, // 2 cái cũ update trạng thái
    };
  },
};
