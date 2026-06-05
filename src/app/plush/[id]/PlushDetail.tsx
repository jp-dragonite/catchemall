"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import Link from "next/link";
import type { Condition, Plush } from "@/lib/types";
import { artworkUrl, fetchPokemonDetails, type PokemonDetails } from "@/lib/pokeapi";
import { useCollection } from "@/lib/collection";
import { TypeBadge } from "@/components/TypeBadge";
import { StatusToggle } from "@/components/StatusToggle";
import { BuySuggestions } from "@/components/BuySuggestions";

const CONDITIONS: Condition[] = ["mint", "good", "fair", "loved"];
const fieldClass =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800";

export function PlushDetail({ plush }: { plush: Plush }) {
  const { getEntry, updateEntry, hydrated } = useCollection();
  const entry = getEntry(plush.id);

  const [details, setDetails] = useState<PokemonDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    let active = true;
    setLoadingDetails(true);
    fetchPokemonDetails(plush.dexId).then((d) => {
      if (active) {
        setDetails(d);
        setLoadingDetails(false);
      }
    });
    return () => {
      active = false;
    };
  }, [plush.dexId]);

  function onPhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Reset so picking the same file again still fires onChange.
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateEntry(plush.id, { photoDataUrl: String(reader.result) });
    reader.readAsDataURL(file);
  }

  const tracked = Boolean(entry);

  return (
    <div className="flex flex-col gap-6">
      <Link href="/" className="text-sm text-zinc-500 hover:underline dark:text-zinc-400">
        ← Back to browse
      </Link>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left: artwork + facts */}
        <div className="flex flex-col gap-4">
          <div className="plush-stage relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={entry?.photoDataUrl ?? artworkUrl(plush.dexId)}
              alt={plush.name}
              className={
                entry?.photoDataUrl
                  ? "h-full w-full object-cover"
                  : "plush-art h-full w-full object-contain p-6"
              }
            />
            {entry?.photoDataUrl && (
              <span className="absolute left-3 top-3 rounded-full bg-zinc-900/70 px-2 py-0.5 text-xs text-white">
                Your photo
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{plush.name}</h1>
              <span className="text-sm text-zinc-400">
                #{String(plush.dexId).padStart(3, "0")}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {plush.types.map((t) => (
                <TypeBadge key={t} type={t} />
              ))}
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <Fact label="Line" value={plush.line} />
            <Fact label="Size" value={plush.size} />
            <Fact label="Generation" value={`Gen ${plush.generation}`} />
            {plush.releaseYear != null && (
              <Fact label="Released" value={String(plush.releaseYear)} />
            )}
            <Fact label="Rarity" value={plush.rarity} />
            {plush.retailPrice != null && <Fact label="Retail" value={`$${plush.retailPrice.toFixed(2)}`} />}
          </dl>

          {/* Live PokéAPI data */}
          <div className="rounded-xl border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
              From PokéAPI
            </p>
            {loadingDetails ? (
              <p className="text-zinc-400">Loading Pokédex data…</p>
            ) : details ? (
              <>
                <p>
                  Height {details.heightM.toFixed(1)} m · Weight {details.weightKg.toFixed(1)} kg
                </p>
                {details.flavorText && (
                  <p className="mt-1 italic text-zinc-500 dark:text-zinc-400">
                    “{details.flavorText}”
                  </p>
                )}
              </>
            ) : (
              <p className="text-zinc-400">Pokédex data unavailable (offline?).</p>
            )}
          </div>
        </div>

        {/* Right: collection tracking */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <h2 className="mb-2 font-semibold">Status</h2>
            <StatusToggle plushId={plush.id} />
            {hydrated && !tracked && (
              <p className="mt-2 text-xs text-zinc-400">
                Mark this plush as Owned or Wishlist to record details below.
              </p>
            )}
          </div>

          <BuySuggestions plush={plush} />

          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <h2 className="mb-3 font-semibold">Your details</h2>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1 text-sm">
                <span className="font-medium">Photo</span>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-red-400">
                    <CameraIcon />
                    {entry?.photoDataUrl ? "Change photo" : "Add photo"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onPhoto}
                      className="sr-only"
                    />
                  </label>
                  {entry?.photoDataUrl && (
                    <button
                      type="button"
                      onClick={() => updateEntry(plush.id, { photoDataUrl: undefined })}
                      className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium">Price paid ($)</span>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    inputMode="decimal"
                    value={entry?.pricePaid ?? ""}
                    onChange={(e) =>
                      updateEntry(plush.id, {
                        pricePaid: e.target.value === "" ? undefined : Number(e.target.value),
                      })
                    }
                    className={fieldClass}
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium">Condition</span>
                  <select
                    value={entry?.condition ?? ""}
                    onChange={(e) =>
                      updateEntry(plush.id, {
                        condition: e.target.value === "" ? undefined : (e.target.value as Condition),
                      })
                    }
                    className={fieldClass}
                  >
                    <option value="">—</option>
                    {CONDITIONS.map((c) => (
                      <option key={c} value={c}>
                        {c[0].toUpperCase() + c.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium">Where bought</span>
                <input
                  type="text"
                  value={entry?.whereBought ?? ""}
                  onChange={(e) => updateEntry(plush.id, { whereBought: e.target.value })}
                  placeholder="Pokémon Center, eBay, a convention…"
                  className={fieldClass}
                />
              </label>

              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium">Notes</span>
                <textarea
                  rows={4}
                  value={entry?.notes ?? ""}
                  onChange={(e) => updateEntry(plush.id, { notes: e.target.value })}
                  placeholder="Tag still attached, gift from…, variant details…"
                  className={fieldClass}
                />
              </label>

              {entry?.dateAdded && (
                <p className="text-xs text-zinc-400">
                  Added {new Date(entry.dateAdded).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-zinc-400">{label}</dt>
      <dd className="font-medium capitalize">{value}</dd>
    </div>
  );
}

function CameraIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}
