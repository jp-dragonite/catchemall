"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Browse" },
  { href: "/stats", label: "My Collection" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
          <span className="text-xl" aria-hidden>
            🧸
          </span>
          <span className="text-lg">
            Catch&nbsp;<span className="text-red-500">&apos;Em&nbsp;All</span>
          </span>
        </Link>
        <nav className="flex gap-1 text-sm font-medium">
          {NAV.map((item) => {
            // Treat /plush/* as part of Browse.
            const active =
              item.href === "/"
                ? pathname === "/" || pathname.startsWith("/plush")
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-1.5 transition-colors ${
                  active
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
