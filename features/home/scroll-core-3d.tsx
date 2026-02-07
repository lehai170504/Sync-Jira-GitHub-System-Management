"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export function ScrollCore3D() {
  const { scrollYProgress } = useScroll();

  // 1. Physics mượt mà
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // 2. Mapping vị trí và biến đổi
  const x = useTransform(
    smoothProgress,
    [0, 0.2, 0.5, 0.8, 1],
    ["5vw", "85vw", "50vw", "10vw", "50vw"],
  );
  const y = useTransform(smoothProgress, [0, 1], ["15vh", "90vh"]);

  // Xoay 3 chiều để tạo cảm giác 3D giả lập
  const rotateX = useTransform(smoothProgress, [0, 1], [0, 180]);
  const rotateY = useTransform(smoothProgress, [0, 1], [0, 360]);
  const rotateZ = useTransform(smoothProgress, [0, 1], [0, 120]);

  const scale = useTransform(smoothProgress, [0, 0.5, 1], [1, 2.5, 0.8]);

  // Màu sắc: Cam FPT -> Tím Code -> Xanh Success
  const color = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    ["#F27124", "#7c3aed", "#10b981"],
  );

  return (
    <motion.div
      style={{ x, y, zIndex: 40 }}
      className="fixed top-0 left-0 pointer-events-none hidden lg:block perspective-1000"
    >
      {/* CONTAINER CHÍNH - Xoay 3D */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          rotateZ,
          scale,
        }}
        className="relative w-24 h-24 transform-style-3d"
      >
        {/* LỚP 1: KHUNG DÂY (WIREFRAME) */}
        <motion.div
          style={{ borderColor: color }}
          className="absolute inset-0 border-2 border-dashed rounded-full opacity-40 animate-[spin_10s_linear_infinite]"
        />

        {/* LỚP 2: VÒNG QUÉT DỮ LIỆU (DATA RING) */}
        <motion.div
          style={{ borderTopColor: color }}
          className="absolute inset-[-10px] border-t-4 border-transparent rounded-full opacity-80 animate-[spin_3s_linear_infinite_reverse]"
        />

        {/* LỚP 3: LÕI NĂNG LƯỢNG (THE CORE) */}
        <motion.div
          style={{
            background: color,
            boxShadow: "0 0 40px -10px currentColor",
          }}
          className="absolute inset-4 rounded-xl flex items-center justify-center backdrop-blur-md bg-opacity-20 border border-white/20"
        >
          {/* Inner Cube (Giả lập khối lập phương nhỏ bên trong) */}
          <div className="w-8 h-8 bg-white/80 rounded-md animate-pulse" />
        </motion.div>

        {/* LỚP 4: HẠT VỆ TINH (SATELLITES) */}
        <div className="absolute inset-[-20px] animate-[spin_6s_linear_infinite]">
          <motion.div
            style={{ background: color }}
            className="w-3 h-3 rounded-full absolute top-0 left-1/2 -translate-x-1/2 shadow-[0_0_15px_currentColor]"
          />
        </div>
        <div className="absolute inset-[-30px] animate-[spin_8s_linear_infinite_reverse]">
          <motion.div
            style={{ background: color }}
            className="w-2 h-2 rounded-full absolute bottom-0 left-1/2 -translate-x-1/2 shadow-[0_0_15px_currentColor]"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
