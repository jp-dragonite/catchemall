import type { PokemonType } from "@/lib/types";
import { TYPE_COLORS } from "@/lib/typeColors";

export function TypeBadge({ type }: { type: PokemonType }) {
  return (
    <span
      className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold capitalize text-white shadow-sm"
      style={{ backgroundColor: TYPE_COLORS[type] }}
    >
      {type}
    </span>
  );
}
