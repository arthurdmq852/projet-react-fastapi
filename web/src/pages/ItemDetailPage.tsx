import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/ui/Navbar/Navbar.tsx'
import Footer from '../components/ui/Footer/Footer.tsx'
import Button from '../components/ui/Button/Button.tsx';
import { useAuth } from '../context/AuthContext';
import { useCollection } from '../context/CollectionContext';
import { itemsService } from '../services/itemsService';
import { ApiError } from '../services/httpClient';
import type { Item } from '../types/api';

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { estDansLaCollection, addEntry } = useCollection();

  // Dérivé de l'URL, pas besoin de state : évite un setState synchrone superflu dans l'effet.
  const itemId = id !== undefined ? Number(id) : NaN;
  const idInvalide = Number.isNaN(itemId);

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(!idInvalide);
  const [error, setError] = useState<string | null>(null);
  const [ajoutEnCours, setAjoutEnCours] = useState(false);

  useEffect(() => {
    if (idInvalide) return;
    let annule = false;
    async function charger() {
      try {
        const resultat = await itemsService.getItem(itemId);
        if (!annule) setItem(resultat);
      } catch (err) {
        if (!annule) {
          setError(err instanceof ApiError && err.code === 404
            ? "Ce jeu n'existe pas."
            : "Impossible de charger ce jeu.");
        }
      } finally {
        if (!annule) setLoading(false);
      }
    }
    void charger();
    return () => {
      annule = true;
    };
  }, [itemId, idInvalide]);

  const messageErreur = idInvalide ? "Identifiant de jeu invalide." : error;

  async function handleAjouter() {
    if (!item) return;
    setAjoutEnCours(true);
    try {
      await addEntry({ item_id: item.id, statut: "a_decouvrir" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Impossible d'ajouter ce jeu à la collection.");
    } finally {
      setAjoutEnCours(false);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="px-6 pb-24 max-w-3xl mx-auto">
        {loading && <p className="text-white">Chargement…</p>}

        {!loading && messageErreur && <p className="text-red-400">{messageErreur}</p>}

        {!loading && !messageErreur && item && (
          <div className="bg-white rounded-2xl p-6 flex flex-col gap-3 text-black">
            {item.image_url && (
              <img src={item.image_url} alt={item.titre} className="rounded-xl w-full max-h-96 object-cover" />
            )}
            <h1 className="text-3xl font-bold">{item.titre}</h1>
            <p className="text-gray-600">{item.categorie} · {item.annee}</p>
            <p className="text-gray-600">Studio : {item.studio} — Plateforme : {item.plateforme}</p>
            <p>{item.description}</p>

            {isAuthenticated ? (
              estDansLaCollection(item.id) ? (
                <p className="text-green-600 font-semibold">Déjà dans votre collection.</p>
              ) : (
                <Button variant="blue" disabled={ajoutEnCours} onClick={() => void handleAjouter()}>
                  {ajoutEnCours ? "Ajout…" : "Ajouter à ma collection"}
                </Button>
              )
            ) : (
              <Button variant="blue" onClick={() => navigate("/login")}>
                Se connecter pour l'ajouter à ma collection
              </Button>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
