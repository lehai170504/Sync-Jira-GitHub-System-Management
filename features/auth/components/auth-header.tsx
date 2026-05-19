import Link from "next/link";
import Image from "next/image";

export function AuthHeader() {
  return (
    <div className="px-8 py-6 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-4 group">
        <div className="flex items-center gap-3">
          <div className="relative h-28 w-28 flex-shrink-0 rounded-3xl bg-white p-2 shadow-lg ring-1 ring-slate-200/70 dark:ring-white/10 transition-all duration-300 group-hover:scale-105 group-active:scale-95">
            <Image
              src="/images/logo-header.png"
              alt="GraphGrade Logo"
              fill
              className="object-contain scale-110 transition-all"
              priority
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-10 w-px bg-slate-200 dark:bg-white/15 transition-colors"></div>

        {/* --- LOGO FPT --- */}
        <div className="flex-shrink-0 transition-all duration-300 group-hover:scale-105">
          <Image
            src="/images/Logo_Trường_Đại_học_FPT.svg.png"
            alt="FPT University"
            width={140}
            height={45}
            className="h-10 w-auto object-contain transition-all"
            priority
          />
        </div>
      </Link>
    </div>
  );
}
