import Link from "next/link";
import Image from "next/image";

export function AuthHeader() {
  return (
    <div className="px-8 py-6 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-4 group">
        <div className="flex items-center gap-3">
          {" "}
          <div className="relative h-24 w-24 flex-shrink-0">
            <Image
              src="/images/logo-sync.png"
              alt="SyncSystem Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        {/* Divider */}
        <div className="h-8 w-px bg-slate-200"></div>{" "}
        {/* Tăng chiều cao divider cho cân đối */}
        {/* --- LOGO FPT --- */}
        <div className="opacity-90 grayscale group-hover:grayscale-0 transition-all duration-300 flex-shrink-0">
          <Image
            src="/images/Logo_Trường_Đại_học_FPT.svg.png"
            alt="FPT University"
            width={110}
            height={35}
            className="h-8 w-auto object-contain"
            priority
          />
        </div>
      </Link>
    </div>
  );
}
