import { Link as LinkIcon } from "lucide-react";

export function MappingHeader() {
  return (
    <div className="flex flex-col gap-2 border-b border-gray-100 pb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-50 rounded-xl">
          <LinkIcon className="w-6 h-6 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Ánh xạ tài khoản
        </h1>
      </div>
      <p className="text-gray-500 pl-[52px] max-w-2xl">
        Liên kết tài khoản <b>Jira</b> và <b>GitHub</b> của các thành viên để hệ
        thống tự động đồng bộ tiến độ và commit.
      </p>
    </div>
  );
}
