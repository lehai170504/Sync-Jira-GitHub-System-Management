"use client";

import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function BackgroundBeams() {
  const { scrollYProgress } = useScroll();

  // Hiệu ứng dịch chuyển nhẹ của các dầm sáng khi cuộn
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -300]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 bg-white dark:bg-zinc-950 transition-colors duration-500" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/5 dark:bg-orange-500/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-soft-light animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-soft-light animate-pulse [animation-delay:2s]" />

      {/* Moving Beams */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.15] dark:opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="beam-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#F27124" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        <motion.rect
          style={{ y: y1 }}
          x="10%"
          y="0"
          width="1"
          height="1000"
          fill="url(#beam-grad)"
        />
        <motion.rect
          style={{ y: y2 }}
          x="30%"
          y="200"
          width="1"
          height="800"
          fill="url(#beam-grad)"
        />
        <motion.rect
          style={{ y: y3 }}
          x="60%"
          y="-100"
          width="1"
          height="1200"
          fill="url(#beam-grad)"
        />
        <motion.rect
          style={{ y: y1 }}
          x="85%"
          y="400"
          width="1"
          height="900"
          fill="url(#beam-grad)"
        />
      </svg>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,white_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,#09090b_100%)] opacity-40 dark:opacity-60" />
    </div>
  );
}
