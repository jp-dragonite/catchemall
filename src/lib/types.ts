// Shared domain types for Catch 'Em All.

export type PokemonType =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

export type Rarity = "common" | "uncommon" | "rare" | "exclusive";

/**
 * One physical plush product in the catalog. `dexId` is the National Pokédex
 * number, used both to build the PokéAPI artwork URL and to fetch live details.
 */
export interface Plush {
  /** Stable unique id for this specific plush (Pokémon + line + variant). */
  id: string;
  /** Pokémon display name. */
  name: string;
  /** National Pokédex number. */
  dexId: number;
  /** Pokémon typing (1–2 types). */
  types: PokemonType[];
  /** Game generation 1–9. */
  generation: number;
  /** Plush line / brand, e.g. "Pokémon Center". */
  line: string;
  /** Human-readable size, e.g. 'Standard (~8 in)'. */
  size: string;
  /** Year the plush was released, if known. */
  releaseYear?: number;
  /** Retail price in USD, if known. */
  retailPrice?: number;
  rarity: Rarity;
}

/** Where a plush sits in the user's collection. */
export type CollectionStatus = "owned" | "wishlist";

export type Condition = "mint" | "good" | "fair" | "loved";

/** Per-plush data the user records. Stored in localStorage. */
export interface CollectionEntry {
  status: CollectionStatus;
  /** ISO date the entry was created. */
  dateAdded: string;
  notes?: string;
  /** What the user actually paid, USD. */
  pricePaid?: number;
  whereBought?: string;
  condition?: Condition;
  /** Optional user photo, stored as a data URL. */
  photoDataUrl?: string;
}

/** Map of plush id -> the user's entry for it. */
export type Collection = Record<string, CollectionEntry>;
