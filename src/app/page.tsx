"use client";

import { useMemo, useState } from "react";
import { PLUSHES, PLUSH_LINES, GENERATIONS } from "@/data/plushes";
import { TYPE_COLORS } from "@/lib/typeColors";
import { useCollection } from "@/lib/collection";
import { PlushCard } from "@/components/PlushCard";
import type { PokemonType } from "@/lib/types";

const ALL_TYPES = Object.keys(TYPE_COLORS) as PokemonType[];

type StatusFilter = "all" | "owned" | "wishlist" | "uncollected";
type SortKey = "dex" | "name" | "release";

const selectClass =
  "rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800";

export default function BrowsePage() {
  const { collection, getEntry, hydrated } = useCollection();

  const [search, setSearch] = useState("");
  const [type, setType] = useState<PokemonType | "all">("all");
  const [generation, setGeneration] = useState<number | "all">("all");
  const [line, setLine] = useState<string | "all">("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortKey>("dex");

  const ownedCount = useMemo(
    () => Object.values(collection).filter((e) => e.status === "owned").length,
    [collection],
  );
  const wishlistCount = useMemo(
    () => Object.values(collection).filter((e) => e.status === "wishlist").length,
    [collection],
  );
  const pct = Math.round((ownedCount / PLUSHES.length) * 100);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = PLUSHES.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (type !== "all" && !p.types.includes(type)) return false;
      if (generation !== "all" && p.generation !== generation) return false;
      if (line !== "all" && p.line !== line) return false;

      const entryStatus = getEntry(p.id)?.status;
      if (status === "owned" && entryStatus !== "owned") return false;
      if (status === "wishlist" && entryStatus !== "wishlist") return false;
      if (status === "uncollected" && entryStatus) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "release") return b.releaseYear - a.releaseYear;
      return a.dexId - b.dexId;
    });
  }, [search, type, generation, line, status, sort, getEntry]);

  return (
    <div className="flex flex-col gap-5">
      {/* Collection summary */}
      <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold">Your plush collection</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {hydrated ? (
                <>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {ownedCount}
                  </span>{" "}
                  owned ·{" "}
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {wishlistCount}
                  </span>{" "}
                  on wishlist · {PLUSHES.length} in catalog
                </>
              ) : (
                "Loading your collection…"
              )}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold tabular-nums">{hydrated ? pct : 0}%</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">complete</div>
          </div>
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${hydrated ? pct : 0}%` }}
          />
        </div>
      </section>

      {/* Filters */}
      <section className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name…"
          className={`${selectClass} flex-1 min-w-[160px]`}
        />
        <select
          className={selectClass}
          value={type}
          onChange={(e) => setType(e.target.value as PokemonType | "all")}
        >
          <option value="all">All types</option>
          {ALL_TYPES.map((t) => (
            <option key={t} value={t}>
              {t[0].toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          value={generation}
          onChange={(e) => setGeneration(e.target.value === "all" ? "all" : Number(e.target.value))}
        >
          <option value="all">All gens</option>
          {GENERATIONS.map((g) => (
            <option key={g} value={g}>
              Gen {g}
            </option>
          ))}
        </select>
        <select className={selectClass} value={line} onChange={(e) => setLine(e.target.value)}>
          <option value="all">All lines</option>
          {PLUSH_LINES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusFilter)}
        >
          <option value="all">All statuses</option>
          <option value="owned">Owned</option>
          <option value="wishlist">Wishlist</option>
          <option value="uncollected">Not collected</option>
        </select>
        <select
          className={selectClass}
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
        >
          <option value="dex">Sort: Dex #</option>
          <option value="name">Sort: Name</option>
          <option value="release">Sort: Newest</option>
        </select>
      </section>

      {/* Results */}
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Showing {visible.length} of {PLUSHES.length} plushies
      </p>
      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-10 text-center text-zinc-500 dark:border-zinc-700">
          No plushies match those filters.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((plush) => (
            <PlushCard key={plush.id} plush={plush} />
          ))}
        </div>
      )}
    </div>
  );
}
