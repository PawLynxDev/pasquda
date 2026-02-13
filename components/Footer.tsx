import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.04] py-8 sm:py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 sm:flex-row sm:justify-between sm:gap-4">
        <div className="flex items-center gap-3">
          <Image
            src="/pasquda_logo_dark.png"
            alt="Pasquda"
            width={28}
            height={28}
            className="h-6 w-6 sm:h-7 sm:w-7"
          />
          <span className="text-xs text-pasquda-gray/40 sm:text-sm">
            Built with 🔥 by Pasquda
          </span>
        </div>

        <p className="text-[11px] text-pasquda-gray/20 sm:text-xs">
          For entertainment purposes only &middot; &copy;{" "}
          {new Date().getFullYear()} Pasquda
        </p>
      </div>
    </footer>
  );
}
