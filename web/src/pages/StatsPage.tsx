import { useEffect, useState } from 'react';
import Navbar from '../components/ui/Navbar/Navbar.tsx'
import Footer from '../components/ui/Footer/Footer.tsx'
import { useAuth } from '../context/AuthContext';
import { collectionService } from '../services/collectionService';
import { ApiError } from '../services/httpClient';
import type { Stats } from '../types/api';

const LIBELLES_STATUT: Record<string, string> = {
  a_decouvrir: "À découvrir",
  en_cours: "En cours",
  termine: "Terminé",
};

export default function StatsPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let annule = false;

    async function charger() {
      setLoading(true);
      setError(null);
      try {
        const resultat = await collectionService.getStats(token as string);
        if (!annule) setStats(resultat);
      } catch (err) {
        if (!annule) setError(err instanceof ApiError ? err.message : "Impossible de charger les statistiques.");
      } finally {
        if (!annule) setLoading(false);
      }
    }
    void charger();
    return () => {
      annule = true;
    };
  }, [token]);

  return (
    <div>
      <Navbar />
      <div className="px-6 pb-24">
        <h1 className="text-4xl font-bold text-white">Statistiques</h1>

        {loading && <p className="text-white">Chargement des statistiques…</p>}

        {!loading && error && <p className="text-red-400">{error}</p>}

        {!loading && !error && stats && (
          stats.total === 0 ? (
            <p className="text-white">Ajoutez des jeux à votre collection pour voir vos statistiques.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
              <div className="bg-white rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">{stats.total}</p>
                <p className="text-gray-500">Jeux dans la collection</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">{stats.note_moyenne.toFixed(1)}</p>
                <p className="text-gray-500">Note moyenne</p>
              </div>
              <div className="bg-white rounded-xl p-4 flex flex-col gap-1 sm:col-span-1 col-span-1">
                <p className="text-gray-500 mb-1">Répartition par statut</p>
                {Object.entries(stats.par_statut).map(([statut, nombre]) => (
                  <p key={statut}>{LIBELLES_STATUT[statut] ?? statut} : {nombre}</p>
                ))}
              </div>
            </div>
          )
        )}
      </div>
      <Footer />
    </div>
  );
}
