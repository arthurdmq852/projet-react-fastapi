import { useEffect, useState } from "react";

export function useDebounce<T>(valeur: T, delaiMs = 400): T {
  const [valeurDebattue, setValeurDebattue] = useState(valeur);

  useEffect(() => {
    const timer = window.setTimeout(() => setValeurDebattue(valeur), delaiMs);
    return () => window.clearTimeout(timer);
  }, [valeur, delaiMs]);

  return valeurDebattue;
}
