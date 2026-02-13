import Link from "next/link";
import Image from "next/image";
import { Swords, UserRound, FileText, History } from "lucide-react";

const navLinks = [
  { href: "/battle", label: "Battle", icon: Swords },
  { href: "/linkedin", label: "LinkedIn", icon: UserRound },
  { href: "/resume", label: "Resume", icon: FileText },
  { href: "/history", label: "History", icon: History },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-pasquda-black/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex-shrink-0 transition-opacity hover:opacity-80"
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

        <nav className="flex items-center gap-1 overflow-x-auto sm:gap-2">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-bold text-pasquda-gray/50 transition-all hover:bg-white/[0.04] hover:text-white/80 sm:px-3 sm:py-2 sm:text-sm"
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
