import { useCallback, useState } from "react";

export function useLocalStorage<T>(cle: string, valeurInitiale: T): [T, (v: T) => void] {
  const [valeur, setValeur] = useState<T>(() => {
    try {
      const stocke = window.localStorage.getItem(cle);
      return stocke !== null ? (JSON.parse(stocke) as T) : valeurInitiale;
    } catch {
      return valeurInitiale;
    }
  });

  const setValeurPersistee = useCallback(
    (nouvelleValeur: T) => {
      setValeur(nouvelleValeur);
      try {
        if (nouvelleValeur === null || nouvelleValeur === undefined) {
          window.localStorage.removeItem(cle);
        } else {
          window.localStorage.setItem(cle, JSON.stringify(nouvelleValeur));
        }
      } catch {
        // localStorage indisponible (navigation privée, quota dépassé...) : on ignore silencieusement.
      }
    },
    [cle],
  );

  return [valeur, setValeurPersistee];
}
