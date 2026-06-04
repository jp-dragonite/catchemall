// PokéAPI integration. Artwork URLs are built directly from the Pokédex number
// (no request needed); richer details are fetched on demand and cached.

const SPRITE_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

/** High-res official artwork for a Pokémon, by National Pokédex number. */
export function artworkUrl(dexId: number): string {
  return `${SPRITE_BASE}/other/official-artwork/${dexId}.png`;
}

/** Small pixel sprite, handy for compact lists. */
export function spriteUrl(dexId: number): string {
  return `${SPRITE_BASE}/${dexId}.png`;
}

/** Subset of PokéAPI data we surface on the detail page. */
export interface PokemonDetails {
  dexId: number;
  heightM: number;
  weightKg: number;
  /** English flavor text from the species entry, if available. */
  flavorText?: string;
}

const cache = new Map<number, PokemonDetails>();
const CACHE_KEY = (dexId: number) => `catch-em-all:pokeapi:${dexId}`;

/**
 * Fetch live details for a Pokémon from PokéAPI. Results are memoised in memory
 * and persisted to localStorage so repeat visits are instant and offline-safe.
 * Runs client-side only. Returns null on failure (treat as "details unavailable").
 */
export async function fetchPokemonDetails(dexId: number): Promise<PokemonDetails | null> {
  if (cache.has(dexId)) return cache.get(dexId)!;

  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(CACHE_KEY(dexId));
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as PokemonDetails;
        cache.set(dexId, parsed);
        return parsed;
      } catch {
        // fall through and refetch
      }
    }
  }

  try {
    const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${dexId}`);
    if (!pokeRes.ok) return null;
    const poke = await pokeRes.json();

    let flavorText: string | undefined;
    try {
      const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${dexId}`);
      if (speciesRes.ok) {
        const species = await speciesRes.json();
        const entry = species.flavor_text_entries?.find(
          (e: { language: { name: string } }) => e.language.name === "en",
        );
        flavorText = entry?.flavor_text?.replace(/[\n\f\r]+/g, " ").trim();
      }
    } catch {
      // flavor text is optional
    }

    const details: PokemonDetails = {
      dexId,
      // PokéAPI gives height in decimetres and weight in hectograms.
      heightM: poke.height / 10,
      weightKg: poke.weight / 10,
      flavorText,
    };

    cache.set(dexId, details);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CACHE_KEY(dexId), JSON.stringify(details));
    }
    return details;
  } catch {
    return null;
  }
}
