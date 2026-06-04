import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PLUSHES, getPlushById } from "@/data/plushes";
import { PlushDetail } from "./PlushDetail";

type Props = { params: Promise<{ id: string }> };

// Pre-render one static page per plush at build time (required for `output: export`).
export function generateStaticParams() {
  return PLUSHES.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const plush = getPlushById(id);
  if (!plush) return { title: "Plush not found — Catch 'Em All" };
  return {
    title: `${plush.name} (${plush.line}) — Catch 'Em All`,
    description: `${plush.name} plush from the ${plush.line} line, ${plush.size}, released ${plush.releaseYear}.`,
  };
}

export default async function PlushPage({ params }: Props) {
  const { id } = await params;
  const plush = getPlushById(id);
  if (!plush) notFound();
  return <PlushDetail plush={plush} />;
}
