"use client";

/**
 * Hiển thị patch/diff giống GitHub:
 * - Dòng thêm (+) → nền xanh lá
 * - Dòng xóa (-) → nền đỏ
 */
export function PatchViewer({ patch }: { patch: string }) {
  if (!patch?.trim()) return null;

  const lines = patch.split("\n");

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 font-mono text-xs max-w-full overflow-x-auto">
      <div className="inline-block min-w-max">
        {lines.map((line, i) => {
          const char = line[0] ?? " ";
          const content = line;
          const isAdd = char === "+" && !line.startsWith("+++");
          const isDel = char === "-" && !line.startsWith("---");

          let bg = "";
          let borderL = "";
          if (isAdd) {
            bg = "bg-emerald-50 dark:bg-emerald-950/50";
            borderL = "border-l-4 border-l-emerald-500";
          } else if (isDel) {
            bg = "bg-red-50 dark:bg-red-950/50";
            borderL = "border-l-4 border-l-red-500";
          } else {
            bg = "bg-transparent";
            borderL = "border-l-4 border-l-transparent";
          }

          return (
            <div
              key={i}
              className={`${bg} ${borderL} px-3 py-0.5 whitespace-pre-wrap break-words text-slate-800 dark:text-slate-200 leading-relaxed`}
            >
              <span className="select-none inline-block w-8 text-slate-400 shrink-0">
                {i + 1}
              </span>{" "}
              <span
                className={
                  isAdd
                    ? "text-emerald-800 dark:text-emerald-200"
                    : isDel
                      ? "text-red-800 dark:text-red-200"
                      : ""
                }
              >
                {content || " "}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
