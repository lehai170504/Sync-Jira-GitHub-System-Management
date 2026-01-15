// Đây là nơi chứa logic gọi API GitHub
export const GithubService = {
  async syncCommits(repoUrl: string) {
    console.log(`[GithubService] Đang quét commit từ: ${repoUrl}...`);

    // GIẢ LẬP: Gọi API GitHub (Mất 1.5 giây)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      success: true,
      totalCommits: 45,
      newCommits: 12, // 12 commit mới từ lần sync trước
      linesOfCode: 1540,
    };
  },
};
