import type { Plush } from "@/lib/types";
import { buySuggestions, LINE_NOTES } from "@/lib/buyLinks";

export function BuySuggestions({ plush }: { plush: Plush }) {
  const links = buySuggestions(plush);
  const note = LINE_NOTES[plush.line];

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <h2 className="mb-1 font-semibold">Where to buy</h2>
      <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
        {note ?? "Search popular stores for this plush."}
      </p>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.store}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
              link.official
                ? "border-red-500 bg-red-500 text-white hover:bg-red-600"
                : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-500"
            }`}
          >
            {link.store}
            {link.official && <span className="text-[10px] opacity-80">official</span>}
            <span aria-hidden>↗</span>
          </a>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-zinc-400">
        Links open searches on third-party stores — prices and stock vary.
      </p>
    </div>
  );
}
