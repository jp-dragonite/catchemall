import Link from "next/link";
import type { Plush } from "@/lib/types";
import { artworkUrl } from "@/lib/pokeapi";
import { TypeBadge } from "@/components/TypeBadge";
import { StatusToggle } from "@/components/StatusToggle";

export function PlushCard({ plush }: { plush: Plush }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900">
      <Link href={`/plush/${plush.id}`} className="block">
        <div className="relative aspect-square bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, images served unoptimized */}
          <img
            src={artworkUrl(plush.dexId)}
            alt={plush.name}
            loading="lazy"
            className="h-full w-full object-contain p-4 transition-transform group-hover:scale-105"
          />
          <span className="absolute right-2 top-2 rounded-full bg-zinc-900/70 px-2 py-0.5 text-xs font-medium text-white">
            #{String(plush.dexId).padStart(3, "0")}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <Link href={`/plush/${plush.id}`} className="hover:underline">
            <h3 className="font-semibold leading-tight">{plush.name}</h3>
          </Link>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {plush.line} · {plush.size}
          </p>
        </div>

        <div className="flex flex-wrap gap-1">
          {plush.types.map((t) => (
            <TypeBadge key={t} type={t} />
          ))}
        </div>

        <div className="mt-auto pt-1">
          <StatusToggle plushId={plush.id} />
        </div>
      </div>
    </div>
  );
}
