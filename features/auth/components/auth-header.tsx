import Link from "next/link";
import Image from "next/image";

export function AuthHeader() {
  return (
    <div className="flex items-center">
      <Link
        href="/"
        className="group flex items-center gap-4 transition-all duration-300 hover:opacity-95 active:scale-95"
      >
        {/* GraphGrade Logo */}
        <div className="relative h-16 w-16 flex-shrink-0 rounded-2xl bg-white p-1.5 shadow-lg ring-1 ring-white/60 transition-all duration-300 group-hover:scale-105">
          <Image
            src="/images/logo-header.png"
            alt="GraphGrade Logo"
            fill
            className="object-contain scale-110 transition-all"
            priority
          />
        </div>

        {/* Divider */}
        <div className="hidden h-9 w-px bg-white/15 sm:block" />

        {/* FPT Logo */}
        <div className="relative hidden h-10 w-32 flex-shrink-0 sm:block rounded-xl bg-white px-3 py-2 shadow-md ring-1 ring-white/60 transition-all duration-300 group-hover:scale-105">
          <Image
            src="/images/Logo_Trường_Đại_học_FPT.svg.png"
            alt="FPT University"
            fill
            className="object-contain p-1"
            priority
          />
        </div>
      </Link>
    </div>
  );
}
