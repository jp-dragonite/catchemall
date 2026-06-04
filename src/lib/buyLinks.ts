import type { Plush } from "@/lib/types";

export interface BuyLink {
  store: string;
  url: string;
  /** Official manufacturer/brand storefront vs. a marketplace. */
  official?: boolean;
}

/**
 * Suggested places to buy a given plush. These are pre-filled *search* links
 * (not deep product links) so they keep working as inventory changes, and they
 * adapt to the plush line — e.g. Japanese import lines point at import shops.
 */
export function buySuggestions(plush: Plush): BuyLink[] {
  const term = encodeURIComponent(`${plush.name} plush`);
  const nameOnly = encodeURIComponent(plush.name);

  const links: BuyLink[] = [
    {
      store: "Pokémon Center",
      url: `https://www.pokemoncenter.com/search/${nameOnly}`,
      official: true,
    },
    { store: "Amazon", url: `https://www.amazon.com/s?k=${term}` },
    { store: "eBay", url: `https://www.ebay.com/sch/i.html?_nkw=${term}` },
    { store: "Etsy", url: `https://www.etsy.com/search?q=${term}` },
  ];

  // Line-specific storefronts.
  switch (plush.line) {
    case "Build-A-Bear":
      links.unshift({
        store: "Build-A-Bear",
        url: `https://www.buildabear.com/search?q=${nameOnly}`,
        official: true,
      });
      break;
    case "Sanei All Star Collection":
    case "Banpresto":
      // Japanese import lines — surface a dedicated import retailer.
      links.push({
        store: "AmiAmi (import)",
        url: `https://www.amiami.com/eng/search/list/?s_keywords=${term}`,
      });
      break;
  }

  return links;
}

/** A short note on where a given plush line is typically found. */
export const LINE_NOTES: Record<string, string> = {
  "Pokémon Center":
    "Made for the official Pokémon Center store; also stocked by major retailers.",
  "Sanei All Star Collection":
    "Japanese import line — best found via import shops (AmiAmi) and resellers.",
  Banpresto:
    "Often a Japanese arcade/claw-machine prize; commonly resold on eBay and import sites.",
  "Build-A-Bear": "Available at Build-A-Bear Workshop, in-store and online.",
  Jazwares: "Mass-retail line — widely available at Amazon and big-box stores.",
};
