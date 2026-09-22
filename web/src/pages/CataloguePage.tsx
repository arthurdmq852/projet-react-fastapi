import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/ui/Navbar/Navbar.tsx'
import Footer from '../components/ui/Footer/Footer.tsx'
import SearchBar from '../components/ui/SearchBar/SearchBar.tsx';
import Filter from '../components/catalog/Filter/Filter.tsx';
import Button from '../components/ui/Button/Button.tsx';
import { useDebounce } from '../hooks/useDebounce';
import { itemsService } from '../services/itemsService';
import { ApiError } from '../services/httpClient';
import type { Item } from '../types/api';

const LIMIT = 12;

export default function CataloguePage() {
  const [searchParams] = useSearchParams();
  const [recherche, setRecherche] = useState(searchParams.get('q') ?? '');
  const [categorie, setCategorie] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [categoriesConnues, setCategoriesConnues] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const rechercheDebattue = useDebounce(recherche, 400);

  // Revenir à la page 1 dès que l'utilisateur change un critère (pas besoin d'effet séparé).
  function handleRechercheChange(nouvelleValeur: string) {
    setRecherche(nouvelleValeur);
    setPage(1);
  }

  function handleCategorieChange(nouvelleValeur: string) {
    setCategorie(nouvelleValeur);
    setPage(1);
  }

  useEffect(() => {
    let annule = false;

    async function charger() {
      setLoading(true);
      setError(null);
      try {
        const reponse = await itemsService.getItems({
          q: rechercheDebattue || undefined,
          categorie: categorie || undefined,
          page,
          limit: LIMIT,
        });
        if (annule) return;
        setItems(reponse.results);
        setTotal(reponse.total);
        setCategoriesConnues((precedent) => {
          const nouvelles = reponse.results.map((item) => item.categorie);
          return Array.from(new Set([...precedent, ...nouvelles])).sort();
        });
      } catch (err) {
        if (!annule) {
          setError(err instanceof ApiError ? err.message : "Impossible de charger le catalogue.");
        }
      } finally {
        if (!annule) setLoading(false);
      }
    }

    void charger();
    return () => {
      annule = true;
    };
  }, [rechercheDebattue, categorie, page]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / LIMIT)), [total]);

  return (
    <div>
      <Navbar />
      <div className="px-6 pb-24">
        <h1 className="text-4xl font-bold text-white">Découvrir de nouveaux jeux</h1>

        <div className="flex flex-wrap gap-3 items-center mb-6">
          <SearchBar valeur={recherche} onChange={handleRechercheChange} placeholder="Rechercher un jeu" />
          <Filter categories={categoriesConnues} valeur={categorie} onChange={handleCategorieChange} />
        </div>

        {loading && <p className="text-white">Chargement du catalogue…</p>}

        {!loading && error && <p className="text-red-400">{error}</p>}

        {!loading && !error && items.length === 0 && (
          <p className="text-white">Aucun jeu ne correspond à votre recherche.</p>
        )}

        {!loading && !error && items.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <Link
                  key={item.id}
                  to={`/items/${item.id}`}
                  className="bg-white rounded-xl p-4 flex flex-col gap-1 hover:shadow-lg transition"
                >
                  {item.image_url && (
                    <img src={item.image_url} alt={item.titre} className="rounded-lg w-full h-40 object-cover" />
                  )}
                  <span className="font-semibold text-black">{item.titre}</span>
                  <span className="text-sm text-gray-500">{item.categorie} · {item.annee}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4 mt-6">
              <Button variant="white" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Précédent
              </Button>
              <span className="text-white">Page {page} / {totalPages}</span>
              <Button variant="white" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                Suivant
              </Button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
