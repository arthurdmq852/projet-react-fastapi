import type { ApiErrorBody } from "../types/api";

// Toutes les requêtes réseau de l'app passent par ce client — aucun fetch ailleurs.
const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:8000";

// Traduit le format d'erreur de l'API ({ erreur: { code, message } }) en type exploitable.
export class ApiError extends Error {
  readonly code: number;

  constructor(code: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}

function estCorpsErreur(valeur: unknown): valeur is ApiErrorBody {
  return (
    typeof valeur === "object" &&
    valeur !== null &&
    "erreur" in valeur &&
    typeof (valeur as { erreur?: unknown }).erreur === "object"
  );
}

function construireRequete(
  method: string,
  body: unknown,
  token: string | null | undefined,
): RequestInit {
  const headers = new Headers();
  headers.set("Accept", "application/json");
  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };
}

async function request<T>(
  path: string,
  method: string,
  body?: unknown,
  token?: string | null,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, construireRequete(method, body, token));
  } catch {
    throw new ApiError(0, "Impossible de joindre le serveur. Vérifiez votre connexion.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  let data: unknown = null;
  const texte = await response.text();
  if (texte.length > 0) {
    try {
      data = JSON.parse(texte);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    if (estCorpsErreur(data)) {
      throw new ApiError(data.erreur.code, data.erreur.message);
    }
    throw new ApiError(response.status, `Erreur inattendue (${response.status}).`);
  }

  return data as T;
}

export function buildQueryString(params: Record<string, string | number | undefined>): string {
  const entries = Object.entries(params).filter(
    (entry): entry is [string, string | number] => entry[1] !== undefined && entry[1] !== "",
  );
  if (entries.length === 0) return "";
  const search = new URLSearchParams();
  for (const [cle, valeur] of entries) {
    search.set(cle, String(valeur));
  }
  return `?${search.toString()}`;
}

export const httpClient = {
  get: <T>(path: string, token?: string | null) => request<T>(path, "GET", undefined, token),
  post: <T>(path: string, body: unknown, token?: string | null) =>
    request<T>(path, "POST", body, token),
  patch: <T>(path: string, body: unknown, token?: string | null) =>
    request<T>(path, "PATCH", body, token),
  delete: (path: string, token?: string | null) => request<void>(path, "DELETE", undefined, token),
};
