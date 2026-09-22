import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { authService } from "../services/authService";
import type { User } from "../types/api";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  // Le JWT est gardé en localStorage pour survivre au rechargement de page.
  // Voir la note sécurité section 7 du sujet : c'est pratique mais vulnérable au XSS,
  // un cookie httpOnly posé par le backend serait l'alternative plus sûre.
  const [token, setToken] = useLocalStorage<string | null>("mc_token", null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let annule = false;

    async function chargerUtilisateurCourant() {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const utilisateur = await authService.me(token);
        if (!annule) setUser(utilisateur);
      } catch {
        // Token expiré ou invalide : on nettoie la session locale.
        if (!annule) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!annule) setLoading(false);
      }
    }

    void chargerUtilisateurCourant();
    return () => {
      annule = true;
    };
  }, [token, setToken]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { access_token } = await authService.login({ email, password });
      const utilisateur = await authService.me(access_token);
      setToken(access_token);
      setUser(utilisateur);
    },
    [setToken],
  );

  const register = useCallback(
    async (email: string, password: string) => {
      await authService.register({ email, password });
      await login(email, password);
    },
    [login],
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, [setToken]);

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated: token !== null, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
