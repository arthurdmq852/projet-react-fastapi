import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/ui/Navbar/Navbar.tsx'
import Footer from '../components/ui/Footer/Footer.tsx'
import Button from '../components/ui/Button/Button.tsx'
import { itemsService } from '../services/itemsService'
import { ApiError } from '../services/httpClient'
import type { Item } from '../types/api'

const NB_JEUX = 9 

export default function HomePage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let annule = false;

    async function charger() {
      try {
        const reponse = await itemsService.getItems({ limit: NB_JEUX });
        if (!annule) setItems(reponse.results);
      } catch (err) {
        if (!annule) {
          setError(err instanceof ApiError ? err.message : "Impossible de charger les jeux.");
        }
      } finally {
        if (!annule) setLoading(false);
      }
    }

    void charger();
    return () => {
      annule = true;
    };
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden h-full">
      <Navbar/>
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="flex flex-col items-center text-center px-4 py-10">
          <h1 className="text-white text-3xl font-bold mb-6">Bienvenue sur CHF Marketplace</h1>
          <Button variant="blue" onClick={() => navigate("/catalogue")}>
            Découvrir les jeux du catalogue
          </Button>
        </div>

        <section className="w-full px-6 pb-12 text-left">
          <Link
            to="/catalogue"
            className="mb-6 inline-flex items-center gap-2 text-2xl font-semibold text-white hover:opacity-80"
          >
            Découvrir les jeux
            <span className="text-gray-500" aria-hidden="true">›</span>
          </Link>

          {loading && <p className="text-white">Chargement…</p>}
          {!loading && error && <p className="text-red-400">{error}</p>}

          {!loading && !error && (
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Link key={item.id} to={`/items/${item.id}`} className="group flex flex-col gap-3">
                  <div className="aspect-video overflow-hidden rounded-xl bg-[#1f2028]">
                    <img
                      src={item.image_url}
                      alt={item.titre}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                  <span className="truncate text-white">
                    {item.titre} - {item.plateforme}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer/>
    </div>
  );
}
