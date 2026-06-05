import type { Plush } from "@/lib/types";
import { POKEDEX } from "./pokedex.generated";

/**
 * Baseline catalog: Pokémon Center's "Sitting Cuties" line has a plush for every
 * species, so we generate one entry per National Dex Pokémon from real PokéAPI
 * data (see scripts/build-pokedex.mjs). Curated special-line entries below are
 * layered on top — a single Pokémon can appear across multiple plush lines.
 */
const SITTING_CUTIES: Plush[] = POKEDEX.map((p) => ({
  id: `sitting-cuties-${p.dexId}`,
  name: p.name,
  dexId: p.dexId,
  types: p.types,
  generation: p.generation,
  line: "Pokémon Center",
  size: "Sitting Cuties (~4 in)",
  retailPrice: 14.99,
  rarity: "common",
}));

/**
 * Hand-curated standout plushes (larger sizes, third-party lines, exclusives).
 * Add new ones here; `id` just needs to be unique.
 */
const CURATED: Plush[] = [
  // ---- Generation 1 ----
  { id: "charizard-pc-large", name: "Charizard", dexId: 6, types: ["fire", "flying"], generation: 1, line: "Pokémon Center", size: "Large (~12 in)", releaseYear: 2020, retailPrice: 39.99, rarity: "rare" },
  { id: "vulpix-sanei", name: "Vulpix", dexId: 37, types: ["fire"], generation: 1, line: "Sanei All Star Collection", size: "Small (~6 in)", releaseYear: 2018, retailPrice: 17.99, rarity: "uncommon" },
  { id: "jigglypuff-sanei", name: "Jigglypuff", dexId: 39, types: ["normal", "fairy"], generation: 1, line: "Sanei All Star Collection", size: "Small (~6 in)", releaseYear: 2017, retailPrice: 16.99, rarity: "common" },
  { id: "psyduck-sanei", name: "Psyduck", dexId: 54, types: ["water"], generation: 1, line: "Sanei All Star Collection", size: "Small (~6 in)", releaseYear: 2018, retailPrice: 16.99, rarity: "common" },
  { id: "gengar-banpresto", name: "Gengar", dexId: 94, types: ["ghost", "poison"], generation: 1, line: "Banpresto", size: "Large (~12 in)", releaseYear: 2021, retailPrice: 29.99, rarity: "uncommon" },
  { id: "pikachu-pc-standard", name: "Pikachu", dexId: 25, types: ["electric"], generation: 1, line: "Pokémon Center", size: "Standard (~8 in)", releaseYear: 2016, retailPrice: 19.99, rarity: "common" },
  { id: "pikachu-bab", name: "Pikachu", dexId: 25, types: ["electric"], generation: 1, line: "Build-A-Bear", size: "Large (~16 in)", releaseYear: 2018, retailPrice: 55.0, rarity: "rare" },
  { id: "eevee-pc-standard", name: "Eevee", dexId: 133, types: ["normal"], generation: 1, line: "Pokémon Center", size: "Standard (~8 in)", releaseYear: 2017, retailPrice: 19.99, rarity: "common" },
  { id: "eevee-bab", name: "Eevee", dexId: 133, types: ["normal"], generation: 1, line: "Build-A-Bear", size: "Large (~16 in)", releaseYear: 2019, retailPrice: 55.0, rarity: "rare" },
  { id: "snorlax-pc-large", name: "Snorlax", dexId: 143, types: ["normal"], generation: 1, line: "Pokémon Center", size: "Large (~14 in)", releaseYear: 2020, retailPrice: 44.99, rarity: "rare" },
  { id: "dragonite-pc-large", name: "Dragonite", dexId: 149, types: ["dragon", "flying"], generation: 1, line: "Pokémon Center", size: "Large (~14 in)", releaseYear: 2021, retailPrice: 44.99, rarity: "rare" },
  { id: "mew-pc-standard", name: "Mew", dexId: 151, types: ["psychic"], generation: 1, line: "Pokémon Center", size: "Small (~6 in)", releaseYear: 2022, retailPrice: 21.99, rarity: "exclusive" },

  // ---- Generation 2 ----
  { id: "totodile-sanei", name: "Totodile", dexId: 158, types: ["water"], generation: 2, line: "Sanei All Star Collection", size: "Small (~6 in)", releaseYear: 2020, retailPrice: 17.99, rarity: "uncommon" },
  { id: "pichu-sanei", name: "Pichu", dexId: 172, types: ["electric"], generation: 2, line: "Sanei All Star Collection", size: "Small (~5 in)", releaseYear: 2019, retailPrice: 15.99, rarity: "common" },
  { id: "togepi-pc-standard", name: "Togepi", dexId: 175, types: ["fairy"], generation: 2, line: "Pokémon Center", size: "Small (~6 in)", releaseYear: 2022, retailPrice: 18.99, rarity: "uncommon" },

  // ---- Generation 3 ----
  { id: "gardevoir-pc-large", name: "Gardevoir", dexId: 282, types: ["psychic", "fairy"], generation: 3, line: "Pokémon Center", size: "Large (~12 in)", releaseYear: 2023, retailPrice: 34.99, rarity: "rare" },

  // ---- Generation 4 ----
  { id: "lucario-banpresto", name: "Lucario", dexId: 448, types: ["fighting", "steel"], generation: 4, line: "Banpresto", size: "Large (~12 in)", releaseYear: 2022, retailPrice: 29.99, rarity: "uncommon" },

  // ---- Generation 6 ----
  { id: "greninja-pc-large", name: "Greninja", dexId: 658, types: ["water", "dark"], generation: 6, line: "Pokémon Center", size: "Large (~12 in)", releaseYear: 2023, retailPrice: 34.99, rarity: "rare" },
  { id: "sylveon-pc-standard", name: "Sylveon", dexId: 700, types: ["fairy"], generation: 6, line: "Pokémon Center", size: "Standard (~8 in)", releaseYear: 2021, retailPrice: 21.99, rarity: "uncommon" },

  // ---- Generation 7 ----
  { id: "mimikyu-pc-standard", name: "Mimikyu", dexId: 778, types: ["ghost", "fairy"], generation: 7, line: "Pokémon Center", size: "Standard (~8 in)", releaseYear: 2018, retailPrice: 21.99, rarity: "exclusive" },
];

/** Full catalog: every species (Sitting Cuties) plus curated standouts. */
export const PLUSHES: Plush[] = [...SITTING_CUTIES, ...CURATED];

/** Look up a single plush by its id. */
export function getPlushById(id: string): Plush | undefined {
  return PLUSHES.find((p) => p.id === id);
}

/** All distinct plush lines, sorted, for filter UIs. */
export const PLUSH_LINES: string[] = [...new Set(PLUSHES.map((p) => p.line))].sort();

/** All generations present in the catalog, ascending. */
export const GENERATIONS: number[] = [...new Set(PLUSHES.map((p) => p.generation))].sort(
  (a, b) => a - b,
);
