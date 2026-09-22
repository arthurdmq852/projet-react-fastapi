import { createContext, useContext } from "react";
import type { AddEntryPayload, Entry, Statut, Tri, UpdateEntryPayload } from "../types/api";

export interface CollectionContextValue {
  entries: Entry[];
  loading: boolean;
  error: string | null;
  statutFiltre: Statut | undefined;
  tri: Tri;
  setStatutFiltre: (statut: Statut | undefined) => void;
  setTri: (tri: Tri) => void;
  refresh: () => Promise<void>;
  addEntry: (payload: AddEntryPayload) => Promise<void>;
  updateEntry: (entryId: number, payload: UpdateEntryPayload) => Promise<void>;
  removeEntry: (entryId: number) => Promise<void>;
  estDansLaCollection: (itemId: number) => boolean;
}

export const CollectionContext = createContext<CollectionContextValue | undefined>(undefined);

export function useCollection(): CollectionContextValue {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error("useCollection doit être utilisé à l'intérieur d'un <CollectionProvider>.");
  }
  return context;
}
