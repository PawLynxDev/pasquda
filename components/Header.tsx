import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-pasquda-black/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Image
            src="/pasquda_logo_dark_text.png"
            alt="Pasquda"
            width={140}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>
        <span className="hidden text-sm italic text-pasquda-gray/60 sm:block">
          &ldquo;Pasquda sees everything. And it&apos;s not impressed.&rdquo;
        </span>
      </div>
    </header>
  );
}
