"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Collection, CollectionEntry, CollectionStatus } from "@/lib/types";

const STORAGE_KEY = "catch-em-all:collection:v1";

interface CollectionContextValue {
  /** True once we've loaded from localStorage — guards against SSR/first-paint flicker. */
  hydrated: boolean;
  collection: Collection;
  getEntry: (plushId: string) => CollectionEntry | undefined;
  /** Toggle a status: setting the status it already has clears the entry. */
  toggleStatus: (plushId: string, status: CollectionStatus) => void;
  /** Merge partial fields into an existing (or new) entry. */
  updateEntry: (plushId: string, patch: Partial<CollectionEntry>) => void;
  removeEntry: (plushId: string) => void;
}

const CollectionContext = createContext<CollectionContextValue | null>(null);

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [collection, setCollection] = useState<Collection>({});
  const [hydrated, setHydrated] = useState(false);

  // Load once on mount (client only).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setCollection(JSON.parse(raw) as Collection);
    } catch {
      // Corrupt/empty storage — start fresh.
    }
    setHydrated(true);
  }, []);

  // Persist on every change, but only after the initial load.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
    } catch {
      // Storage full or unavailable — non-fatal.
    }
  }, [collection, hydrated]);

  const getEntry = useCallback(
    (plushId: string) => collection[plushId],
    [collection],
  );

  const toggleStatus = useCallback((plushId: string, status: CollectionStatus) => {
    setCollection((prev) => {
      const existing = prev[plushId];
      // Clicking the active status again removes the plush from the collection.
      if (existing?.status === status) {
        const next = { ...prev };
        delete next[plushId];
        return next;
      }
      const entry: CollectionEntry = existing
        ? { ...existing, status }
        : { status, dateAdded: new Date().toISOString() };
      return { ...prev, [plushId]: entry };
    });
  }, []);

  const updateEntry = useCallback((plushId: string, patch: Partial<CollectionEntry>) => {
    setCollection((prev) => {
      const existing = prev[plushId] ?? {
        status: "owned" as CollectionStatus,
        dateAdded: new Date().toISOString(),
      };
      return { ...prev, [plushId]: { ...existing, ...patch } };
    });
  }, []);

  const removeEntry = useCallback((plushId: string) => {
    setCollection((prev) => {
      const next = { ...prev };
      delete next[plushId];
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ hydrated, collection, getEntry, toggleStatus, updateEntry, removeEntry }),
    [hydrated, collection, getEntry, toggleStatus, updateEntry, removeEntry],
  );

  return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>;
}

export function useCollection(): CollectionContextValue {
  const ctx = useContext(CollectionContext);
  if (!ctx) throw new Error("useCollection must be used inside <CollectionProvider>");
  return ctx;
}
