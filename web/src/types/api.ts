// Types du contrat d'API (section 5 du sujet) — écrits à la main, pas de génération OpenAPI.

export type Statut = "a_decouvrir" | "en_cours" | "termine";

export type Tri = "date" | "note";

export interface Item {
  id: number;
  titre: string;
  categorie: string;
  description: string;
  image_url: string;
  annee: number;
  studio: string;
  plateforme: string;
}

export interface ItemsListResponse {
  total: number;
  page: number;
  limit: number;
  results: Item[];
}

export interface GetItemsParams {
  q?: string;
  categorie?: string;
  page?: number;
  limit?: number;
}

// --- Collection ----------------------------------------------------------------

export interface Entry {
  id: number;
  statut: Statut;
  note: number | null;
  commentaire: string | null;
  date_ajout: string;
  item: Item;
}

export interface GetCollectionParams {
  statut?: Statut;
  tri?: Tri;
}

export interface AddEntryPayload {
  item_id: number;
  statut: Statut;
  note?: number;
  commentaire?: string;
}

export interface UpdateEntryPayload {
  statut?: Statut;
  note?: number;
  commentaire?: string;
}

export interface Stats {
  total: number;
  par_statut: Record<Statut, number>;
  note_moyenne: number;
}

// --- Authentification ------------------------------------------------------------

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
}

// --- Erreurs (handler maison) -----------------------------------------------------

export interface ApiErrorBody {
  erreur: {
    code: number;
    message: string;
  };
}
