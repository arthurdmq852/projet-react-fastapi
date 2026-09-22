
import { useState } from 'react';

// --- Type à adapter selon ton API de jeux ---
export interface Game {
  id: string | number;
  title: string;
  coverUrl?: string;   // URL de la jaquette, si dispo
  rating?: string;     // ex: "E", "7+", "PEGI 12"...
  publisher?: string;
}

// --- Données factices, à remplacer par ton fetch réel ---
const MOCK_GAMES: Game[] = [
  { id: 1, title: "Mario Kart Wii", publisher: "Nintendo", rating: "3+" },
  { id: 2, title: "New Play Control! Mario Power Tennis", publisher: "Nintendo", rating: "3+" },
  { id: 3, title: "Mega Man 10", publisher: "Capcom", rating: "7+" },
  { id: 4, title: "Mega Man 9", publisher: "Capcom", rating: "7+" },
  { id: 5, title: "DK Jungle Climber", publisher: "Nintendo", rating: "E" },
  { id: 6, title: "Nintendo Channel", publisher: "Nintendo", rating: "3+" },
];

interface GameCoverflowProps {
  games?: Game[];
  onSelect?: (game: Game) => void;
}

export default function GameCoverflow({ games = MOCK_GAMES, onSelect }: GameCoverflowProps) {
  const [activeIndex, setActiveIndex] = useState(Math.floor(games.length / 2));

  function goTo(index: number) {
    const clamped = Math.max(0, Math.min(games.length - 1, index));
    setActiveIndex(clamped);
    onSelect?.(games[clamped]);
  }

  return (
    <div className="w-full flex flex-col items-center gap-6 py-10">
      <div
        className="relative w-full flex items-center justify-center"
        style={{ perspective: '1200px', height: '320px' }}
      >
        {games.map((game, index) => {
          const offset = index - activeIndex;
          const isActive = offset === 0;
          const distance = Math.abs(offset);

          if (distance > 3) return null; // on ne rend que les cartes proches, comme sur Wii

          const translateX = offset * 140;
          const rotateY = offset === 0 ? 0 : offset > 0 ? -35 : 35;
          const scale = isActive ? 1 : 0.75 - Math.min(distance, 2) * 0.08;
          const zIndex = 10 - distance;
          const opacity = distance > 3 ? 0 : 1 - distance * 0.15;

          return (
            <button
              key={game.id}
              onClick={() => goTo(index)}
              className="absolute rounded-lg shadow-2xl overflow-hidden border border-white/10 focus:outline-none"
              style={{
                width: '180px',
                height: '250px',
                transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                zIndex,
                opacity,
                transition: 'transform 300ms ease, opacity 300ms ease',
                cursor: 'pointer',
              }}
            >
              {game.coverUrl ? (
                <img
                  src={game.coverUrl}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col justify-between p-3 bg-gradient-to-br from-[#2a2c38] to-[#111218] text-white text-left">
                  <div>
                    {game.rating && (
                      <span className="inline-block text-[10px] font-bold bg-white/10 rounded px-1.5 py-0.5 mb-2">
                        {game.rating}
                      </span>
                    )}
                    <p className="text-sm font-semibold leading-tight">
                      {game.title}
                    </p>
                  </div>
                  {game.publisher && (
                    <p className="text-[10px] uppercase tracking-wide text-gray-400">
                      {game.publisher}
                    </p>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Flèches de navigation, comme sur le menu Wii */}
      <div className="flex items-center gap-8">
        <button
          onClick={() => goTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          className="w-10 h-10 rounded-full border border-[#aa3bff]/50 text-white flex items-center justify-center disabled:opacity-30 hover:bg-[#aa3bff]/10 transition-colors"
        >
          ‹
        </button>

        <p className="text-white font-medium min-w-[180px] text-center">
          {games[activeIndex]?.title}
        </p>

        <button
          onClick={() => goTo(activeIndex + 1)}
          disabled={activeIndex === games.length - 1}
          className="w-10 h-10 rounded-full border border-[#aa3bff]/50 text-white flex items-center justify-center disabled:opacity-30 hover:bg-[#aa3bff]/10 transition-colors"
        >
          ›
        </button>
      </div>
    </div>
  );
}
