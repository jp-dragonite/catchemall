"use client";

import { useMemo } from "react";
import Link from "next/link";
import { PLUSHES } from "@/data/plushes";
import { useCollection } from "@/lib/collection";
import { artworkUrl } from "@/lib/pokeapi";
import type { PokemonType } from "@/lib/types";

function Bar({ label, owned, total }: { label: string; owned: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((owned / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-sm text-zinc-600 dark:text-zinc-300">{label}</span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-16 shrink-0 text-right text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
        {owned}/{total}
      </span>
    </div>
  );
}

export default function StatsPage() {
  const { collection, hydrated } = useCollection();

  const stats = useMemo(() => {
    const ownedIds = new Set(
      Object.entries(collection)
        .filter(([, e]) => e.status === "owned")
        .map(([id]) => id),
    );
    const wishlistIds = new Set(
      Object.entries(collection)
        .filter(([, e]) => e.status === "wishlist")
        .map(([id]) => id),
    );

    const byGen = new Map<number, { owned: number; total: number }>();
    const byType = new Map<PokemonType, { owned: number; total: number }>();
    const byLine = new Map<string, { owned: number; total: number }>();
    let spent = 0;

    for (const p of PLUSHES) {
      const owned = ownedIds.has(p.id);

      const g = byGen.get(p.generation) ?? { owned: 0, total: 0 };
      g.total += 1;
      if (owned) g.owned += 1;
      byGen.set(p.generation, g);

      for (const t of p.types) {
        const tt = byType.get(t) ?? { owned: 0, total: 0 };
        tt.total += 1;
        if (owned) tt.owned += 1;
        byType.set(t, tt);
      }

      const l = byLine.get(p.line) ?? { owned: 0, total: 0 };
      l.total += 1;
      if (owned) l.owned += 1;
      byLine.set(p.line, l);

      if (owned) {
        const paid = collection[p.id]?.pricePaid;
        spent += typeof paid === "number" ? paid : (p.retailPrice ?? 0);
      }
    }

    return {
      ownedIds,
      wishlistIds,
      ownedCount: ownedIds.size,
      wishlistCount: wishlistIds.size,
      spent,
      byGen: [...byGen.entries()].sort((a, b) => a[0] - b[0]),
      byType: [...byType.entries()].sort((a, b) => b[1].owned - a[1].owned),
      byLine: [...byLine.entries()].sort((a, b) => a[0].localeCompare(b[0])),
    };
  }, [collection]);

  if (!hydrated) {
    return <p className="text-zinc-500">Loading your collection…</p>;
  }

  const pct = Math.round((stats.ownedCount / PLUSHES.length) * 100);
  const wishlist = PLUSHES.filter((p) => stats.wishlistIds.has(p.id));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">My Collection</h1>

      {/* Headline cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Owned" value={`${stats.ownedCount}`} sub={`of ${PLUSHES.length}`} />
        <Stat label="Complete" value={`${pct}%`} />
        <Stat label="Wishlist" value={`${stats.wishlistCount}`} />
        <Stat label="Est. value" value={`$${stats.spent.toFixed(0)}`} sub="owned plushies" />
      </div>

      {stats.ownedCount === 0 && stats.wishlistCount === 0 && (
        <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
          <p className="text-zinc-500">
            Nothing tracked yet. Head to{" "}
            <Link href="/" className="font-semibold text-red-500 hover:underline">
              Browse
            </Link>{" "}
            and mark some plushies as Owned or Wishlist.
          </p>
        </div>
      )}

      <section className="grid gap-6 md:grid-cols-2">
        <Panel title="Completion by generation">
          <div className="flex flex-col gap-2">
            {stats.byGen.map(([gen, v]) => (
              <Bar key={gen} label={`Gen ${gen}`} owned={v.owned} total={v.total} />
            ))}
          </div>
        </Panel>

        <Panel title="Completion by line">
          <div className="flex flex-col gap-2">
            {stats.byLine.map(([line, v]) => (
              <Bar key={line} label={line} owned={v.owned} total={v.total} />
            ))}
          </div>
        </Panel>
      </section>

      <Panel title="Completion by type">
        <div className="grid gap-2 sm:grid-cols-2">
          {stats.byType.map(([t, v]) => (
            <Bar key={t} label={t[0].toUpperCase() + t.slice(1)} owned={v.owned} total={v.total} />
          ))}
        </div>
      </Panel>

      {wishlist.length > 0 && (
        <Panel title={`Wishlist (${wishlist.length})`}>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {wishlist.map((p) => (
              <Link
                key={p.id}
                href={`/plush/${p.id}`}
                className="flex flex-col items-center gap-1 rounded-lg p-2 text-center hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={artworkUrl(p.dexId)} alt={p.name} className="h-16 w-16 object-contain" />
                <span className="text-xs font-medium">{p.name}</span>
              </Link>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="text-2xl font-extrabold tabular-nums">{value}</div>
      <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {label}
        {sub ? ` · ${sub}` : ""}
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <h2 className="mb-3 font-semibold">{title}</h2>
      {children}
    </div>
  );
}
