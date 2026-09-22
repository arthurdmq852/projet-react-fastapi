interface FilterProps {
  categories: string[];
  valeur: string;
  onChange: (categorie: string) => void;
}

export default function Filter({ categories, valeur, onChange }: FilterProps) {
  return (
    <select
      value={valeur}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Filtrer par catégorie"
      className="rounded-full px-4 py-2 bg-white text-black border-2 border-gray-300 outline-none focus:outline-2 focus:outline-blue-500 cursor-pointer"
    >
      <option value="">Toutes les catégories</option>
      {categories.map((categorie) => (
        <option key={categorie} value={categorie}>
          {categorie}
        </option>
      ))}
    </select>
  );
}
