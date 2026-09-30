import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar/Navbar.tsx'
import Footer from '../components/ui/Footer/Footer.tsx'
import { useAuth } from '../context/AuthContext';
import { collectionService } from '../services/collectionService';
import { ApiError } from '../services/httpClient';
import type { Stats, Statut } from '../types/api';

const STATUTS: { cle: Statut; libelle: string; couleur: string }[] = [
  { cle: "a_decouvrir", libelle: "À découvrir", couleur: "bg-sky-400" },
  { cle: "en_cours", libelle: "En cours", couleur: "bg-amber-400" },
  { cle: "termine", libelle: "Terminé", couleur: "bg-emerald-400" },
];

const PANNEAU = "overflow-hidden rounded-2xl border border-[#2e303a] bg-[#1f2028]";

function IconeEtoile({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function Etoiles({ valeur }: { valeur: number | null }) {
  return (
    <div
      className="flex gap-1"
      role="img"
      aria-label={valeur === null ? "Aucune note" : `Note moyenne : ${valeur.toFixed(1)} sur 5`}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const remplissage = valeur === null ? 0 : Math.max(0, Math.min(1, valeur - i)) * 100;
        return (
          <span key={i} className="relative inline-block h-7 w-7">
            <IconeEtoile className="absolute inset-0 h-7 w-7 text-[#2e303a]" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${remplissage}%` }}>
              <IconeEtoile className="h-7 w-7 max-w-none shrink-0 text-purple-400" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

function Repartition({ stats }: { stats: Stats }) {
  // Les segments partent de 0 puis s'étirent une seule fois à l'affichage.
  const [pret, setPret] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setPret(true), 60);
    return () => window.clearTimeout(id);
  }, []);

  const resume = STATUTS.map((s) => `${stats.par_statut[s.cle] ?? 0} ${s.libelle.toLowerCase()}`).join(", ");

  return (
    <div className="border-t border-[#2e303a] p-6 md:p-8">
      <h2 className="mb-5 text-lg font-medium text-white">Répartition par statut</h2>

      <div className="mb-6 flex h-4 w-full gap-0.5 overflow-hidden rounded-full bg-[#2e303a]" role="img" aria-label={resume}>
        {STATUTS.map((s) => {
          const nombre = stats.par_statut[s.cle] ?? 0;
          const largeur = pret ? (nombre / stats.total) * 100 : 0;
          return (
            <div
              key={s.cle}
              className={`${s.couleur} h-full transition-[width] duration-700 ease-out motion-reduce:transition-none`}
              style={{ width: `${largeur}%` }}
            />
          );
        })}
      </div>

      <ul className="flex flex-col gap-3">
        {STATUTS.map((s) => {
          const nombre = stats.par_statut[s.cle] ?? 0;
          return (
            <li key={s.cle} className="flex items-center gap-3">
              <span className={`${s.couleur} h-3 w-3 shrink-0 rounded-full`} aria-hidden="true" />
              <span className="flex-1 text-left text-gray-200">{s.libelle}</span>
              <span className="font-semibold tabular-nums text-white">{nombre}</span>
              <span className="w-12 text-right text-sm tabular-nums text-gray-500">
                {Math.round((nombre / stats.total) * 100)} %
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function StatsPage() {
  const { token }             = useAuth();
  const [stats, setStats]     = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

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
    <div className="flex flex-1 min-h-0 flex-col">
      <Navbar />
      <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6">
        <div className="mx-auto w-full max-w-3xl text-left">
          <h1 className="text-4xl font-bold text-white">Statistiques</h1>

          {loading && <div className={`${PANNEAU} h-72 animate-pulse motion-reduce:animate-none`} aria-label="Chargement des statistiques" />}

          {!loading && error && (
            <p className="rounded-xl border border-red-400/40 bg-red-400/10 p-4 text-red-300">{error}</p>
          )}

          {!loading && !error && stats && (
            stats.total === 0 ? (
              <div className={`${PANNEAU} flex flex-col items-start gap-4 p-6 md:p-8`}>
                <p className="text-lg text-white">Votre collection est vide pour l'instant.</p>
                <p className="text-gray-400">Ajoutez des jeux pour voir la répartition et votre note moyenne.</p>
                <Link
                  to="/catalogue"
                  className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                  Parcourir le catalogue
                </Link>
              </div>
            ) : (
              <section className={PANNEAU}>
                <div className="grid md:grid-cols-2">
                  <div className="p-6 md:p-8">
                    <p className="text-6xl font-semibold tracking-tight tabular-nums text-white">{stats.total}</p>
                    <p className="mt-2 text-gray-400">
                      {stats.total === 1 ? "jeu dans votre collection" : "jeux dans votre collection"}
                    </p>
                  </div>

                  <div className="border-t border-[#2e303a] p-6 md:border-l md:border-t-0 md:p-8">
                    <p className="flex items-baseline gap-2">
                      <span className="text-6xl font-semibold tracking-tight tabular-nums text-white">
                        {stats.note_moyenne !== null ? stats.note_moyenne.toFixed(1) : "—"}
                      </span>
                      <span className="text-2xl text-gray-500">/ 5</span>
                    </p>
                    <div className="mt-3">
                      <Etoiles valeur={stats.note_moyenne} />
                    </div>
                    <p className="mt-2 text-gray-400">
                      {stats.note_moyenne !== null ? (
                        "note moyenne"
                      ) : (
                        <>
                          Aucune note pour l'instant.{" "}
                          <Link to="/collection" className="text-purple-400 underline hover:text-purple-300">
                            Notez vos jeux
                          </Link>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <Repartition stats={stats} />
              </section>
            )
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
