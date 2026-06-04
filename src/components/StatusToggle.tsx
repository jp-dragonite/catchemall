"use client";

import { useCollection } from "@/lib/collection";
import type { CollectionStatus } from "@/lib/types";

const OPTIONS: { status: CollectionStatus; label: string; activeClass: string }[] = [
  { status: "owned", label: "Owned", activeClass: "bg-emerald-500 text-white border-emerald-500" },
  { status: "wishlist", label: "Wishlist", activeClass: "bg-amber-400 text-zinc-900 border-amber-400" },
];

/**
 * Owned / Wishlist pill toggle for a plush. Clicking the active status again
 * clears it. Renders nothing interactive until the collection is hydrated to
 * avoid a flash of the wrong state.
 */
export function StatusToggle({ plushId }: { plushId: string }) {
  const { getEntry, toggleStatus, hydrated } = useCollection();
  const current = getEntry(plushId)?.status;

  return (
    <div className="flex gap-1.5" aria-busy={!hydrated}>
      {OPTIONS.map((opt) => {
        const active = current === opt.status;
        return (
          <button
            key={opt.status}
            type="button"
            onClick={() => toggleStatus(plushId, opt.status)}
            aria-pressed={active}
            className={`flex-1 rounded-md border px-2 py-1 text-xs font-semibold transition-colors ${
              active
                ? opt.activeClass
                : "border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-500"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
