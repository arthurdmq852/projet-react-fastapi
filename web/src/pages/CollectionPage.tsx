import { Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar/Navbar.tsx'
import Footer from '../components/ui/Footer/Footer.tsx'
import Button from '../components/ui/Button/Button.tsx';
import { useCollection } from '../context/CollectionContext';
import type { Statut, Tri } from '../types/api';

const STATUTS: { valeur: Statut; libelle: string }[] = [
  { valeur: "a_decouvrir", libelle: "À découvrir" },
  { valeur: "en_cours", libelle: "En cours" },
  { valeur: "termine", libelle: "Terminé" },
];

export default function CollectionPage() {
  const {
    entries,
    loading,
    error,
    statutFiltre,
    tri,
    setStatutFiltre,
    setTri,
    updateEntry,
    removeEntry,
  } = useCollection();

  return (
    <div>
      <Navbar />
      <div className="px-6 pb-24">
        <h1 className="text-4xl font-bold text-white">Ma collection</h1>

        <div className="flex flex-wrap gap-3 items-center mb-6">
          <select
            value={statutFiltre ?? ""}
            onChange={(e) => setStatutFiltre(e.target.value === "" ? undefined : (e.target.value as Statut))}
            className="rounded-full px-4 py-2 bg-white text-black border-2 border-gray-300 outline-none cursor-pointer"
          >
            <option value="">Tous les statuts</option>
            {STATUTS.map((s) => (
              <option key={s.valeur} value={s.valeur}>{s.libelle}</option>
            ))}
          </select>

          <select
            value={tri}
            onChange={(e) => setTri(e.target.value as Tri)}
            className="rounded-full px-4 py-2 bg-white text-black border-2 border-gray-300 outline-none cursor-pointer"
          >
            <option value="date">Trier par date d'ajout</option>
            <option value="note">Trier par note</option>
          </select>
        </div>

        {loading && <p className="text-white">Chargement de votre collection…</p>}

        {!loading && error && <p className="text-red-400">{error}</p>}

        {!loading && !error && entries.length === 0 && (
          <p className="text-white">
            Votre collection est vide pour l'instant. <Link to="/catalogue" className="underline">Parcourez le catalogue</Link> pour ajouter des jeux.
          </p>
        )}

        {!loading && !error && entries.length > 0 && (
          <div className="flex flex-col gap-4">
            {entries.map((entry) => (
              <div key={entry.id} className="bg-white rounded-xl p-4 flex flex-col sm:flex-row gap-4 text-black">
                {entry.item.image_url && (
                  <img src={entry.item.image_url} alt={entry.item.titre} className="rounded-lg w-full sm:w-32 h-32 object-cover" />
                )}
                <div className="flex-1 flex flex-col gap-2">
                  <Link to={`/items/${entry.item.id}`} className="font-semibold text-lg">{entry.item.titre}</Link>

                  <div className="flex flex-wrap gap-3 items-center text-sm">
                    <label className="flex items-center gap-2">
                      Statut
                      <select
                        value={entry.statut}
                        onChange={(e) => void updateEntry(entry.id, { statut: e.target.value as Statut })}
                        className="rounded-lg px-2 py-1 border border-gray-300"
                      >
                        {STATUTS.map((s) => (
                          <option key={s.valeur} value={s.valeur}>{s.libelle}</option>
                        ))}
                      </select>
                    </label>

                    <label className="flex items-center gap-2">
                      Note
                      <select
                        value={entry.note ?? ""}
                        onChange={(e) =>
                          void updateEntry(entry.id, {
                            note: e.target.value === "" ? undefined : Number(e.target.value),
                          })
                        }
                        className="rounded-lg px-2 py-1 border border-gray-300"
                      >
                        <option value="">—</option>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <textarea
                    defaultValue={entry.commentaire ?? ""}
                    onBlur={(e) => void updateEntry(entry.id, { commentaire: e.target.value })}
                    placeholder="Votre commentaire…"
                    className="rounded-lg px-3 py-2 border border-gray-300 text-sm"
                    rows={2}
                  />

                  <Button variant="white" className="self-start" onClick={() => void removeEntry(entry.id)}>
                    Retirer de la collection
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
