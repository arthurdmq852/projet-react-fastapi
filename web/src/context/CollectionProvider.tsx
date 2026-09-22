import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { CollectionContext } from "./CollectionContext";
import { useAuth } from "./AuthContext";
import { collectionService } from "../services/collectionService";
import { ApiError } from "../services/httpClient";
import type { AddEntryPayload, Entry, Statut, Tri, UpdateEntryPayload } from "../types/api";

interface CollectionProviderProps {
  children: ReactNode;
}

export default function CollectionProvider({ children }: CollectionProviderProps) {
  const { token } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statutFiltre, setStatutFiltre] = useState<Statut | undefined>(undefined);
  const [tri, setTri] = useState<Tri>("date");

  const refresh = useCallback(async () => {
    if (!token) {
      setEntries([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const resultat = await collectionService.getCollection(token, { statut: statutFiltre, tri });
      setEntries(resultat);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Impossible de charger la collection.");
    } finally {
      setLoading(false);
    }
  }, [token, statutFiltre, tri]);

  useEffect(() => {
    let annule = false;

    async function charger() {
      if (!token) {
        setEntries([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const resultat = await collectionService.getCollection(token, { statut: statutFiltre, tri });
        if (!annule) setEntries(resultat);
      } catch (err) {
        if (!annule) {
          setError(err instanceof ApiError ? err.message : "Impossible de charger la collection.");
        }
      } finally {
        if (!annule) setLoading(false);
      }
    }

    void charger();
    return () => {
      annule = true;
    };
  }, [token, statutFiltre, tri]);

  const addEntry = useCallback(
    async (payload: AddEntryPayload) => {
      if (!token) throw new Error("Vous devez être connecté.");
      const entry = await collectionService.addEntry(token, payload);
      setEntries((precedent) => [entry, ...precedent]);
    },
    [token],
  );

  const updateEntry = useCallback(
    async (entryId: number, payload: UpdateEntryPayload) => {
      if (!token) throw new Error("Vous devez être connecté.");
      const entryMaj = await collectionService.updateEntry(token, entryId, payload);
      setEntries((precedent) => precedent.map((e) => (e.id === entryId ? entryMaj : e)));
    },
    [token],
  );

  const removeEntry = useCallback(
    async (entryId: number) => {
      if (!token) throw new Error("Vous devez être connecté.");
      await collectionService.deleteEntry(token, entryId);
      setEntries((precedent) => precedent.filter((e) => e.id !== entryId));
    },
    [token],
  );

  const estDansLaCollection = useCallback(
    (itemId: number) => entries.some((e) => e.item.id === itemId),
    [entries],
  );

  return (
    <CollectionContext.Provider
      value={{
        entries,
        loading,
        error,
        statutFiltre,
        tri,
        setStatutFiltre,
        setTri,
        refresh,
        addEntry,
        updateEntry,
        removeEntry,
        estDansLaCollection,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
}
