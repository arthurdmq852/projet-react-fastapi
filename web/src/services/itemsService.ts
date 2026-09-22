import { buildQueryString, httpClient } from "./httpClient";
import type { GetItemsParams, Item, ItemsListResponse } from "../types/api";

export const itemsService = {
  getItems: (params: GetItemsParams = {}): Promise<ItemsListResponse> => {
    const qs = buildQueryString({
      q: params.q,
      categorie: params.categorie,
      page: params.page,
      limit: params.limit,
    });
    return httpClient.get<ItemsListResponse>(`/items${qs}`);
  },

  getItem: (itemId: number): Promise<Item> => httpClient.get<Item>(`/items/${itemId}`),
};
