import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Cho phép ảnh từ Unsplash (ảnh nền)
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com", // Cho phép ảnh từ Dicebear (avatar nhân vật)
      },
      {
        protocol: "https",
        hostname: "github.com", // Cho phép ảnh từ GitHub (nếu dùng avatar GitHub)
      },
    ],
  },
};

export default nextConfig;
