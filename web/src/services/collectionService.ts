import { buildQueryString, httpClient } from "./httpClient";
import type { AddEntryPayload, Entry, GetCollectionParams, Stats, UpdateEntryPayload } from "../types/api";

export const collectionService = {
  getCollection: (token: string, params: GetCollectionParams = {}): Promise<Entry[]> => {
    const qs = buildQueryString({ statut: params.statut, tri: params.tri });
    return httpClient.get<Entry[]>(`/me/collection${qs}`, token);
  },

  addEntry: (token: string, payload: AddEntryPayload): Promise<Entry> =>
    httpClient.post<Entry>("/me/collection", payload, token),

  updateEntry: (token: string, entryId: number, payload: UpdateEntryPayload): Promise<Entry> =>
    httpClient.patch<Entry>(`/me/collection/${entryId}`, payload, token),

  deleteEntry: (token: string, entryId: number): Promise<void> =>
    httpClient.delete(`/me/collection/${entryId}`, token),

  getStats: (token: string): Promise<Stats> => httpClient.get<Stats>("/me/stats", token),
};
