import { Link as LinkIcon } from "lucide-react";

export function MappingHeader() {
  return (
    <div className="flex flex-col gap-2 border-b border-gray-100 dark:border-slate-800 pb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
          <LinkIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50 tracking-tight">
          Ánh xạ tài khoản
        </h1>
      </div>
      <p className="text-gray-500 dark:text-slate-400 pl-[52px] max-w-2xl">
        <b>Leader</b> có thể ánh xạ cho cả nhóm; <b>thành viên</b> chỉnh được{" "}
        <b>dòng của mình</b>. Liên kết <b>Jira</b> và <b>GitHub</b> để hệ thống
        đồng bộ tiến độ và commit.
      </p>
    </div>
  );
}
