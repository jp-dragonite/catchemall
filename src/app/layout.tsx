import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CollectionProvider } from "@/lib/collection";
import { Header } from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Catch 'Em All — Pokémon Plush Collection Tracker",
  description:
    "Track your Pokémon plush toy collection: mark what you own, build a wishlist, and watch your completion grow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CollectionProvider>
          <Header />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
          <footer className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-400 dark:border-zinc-800">
            Catch &apos;Em All · plush data is fan-curated · artwork &amp; details via PokéAPI
          </footer>
        </CollectionProvider>
      </body>
    </html>
  );
}
