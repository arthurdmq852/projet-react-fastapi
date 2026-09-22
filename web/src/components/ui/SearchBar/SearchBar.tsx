import { useState } from 'react';
import type { KeyboardEvent } from 'react';

interface SearchBarProps {
  // Contrôlé : le parent gère l'état (ex. CataloguePage + debounce).
  valeur?: string;
  onChange?: (valeur: string) => void;
  // Non-contrôlé : garde son propre état et prévient au Entrée (ex. barre de la Navbar).
  onSubmit?: (valeur: string) => void;
  placeholder?: string;
}

export default function SearchBar({ valeur, onChange, onSubmit, placeholder = "Rechercher" }: SearchBarProps) {
  const [valeurInterne, setValeurInterne] = useState("");
  const valeurAffichee = valeur ?? valeurInterne;

  function handleChange(nouvelleValeur: string) {
    if (onChange) {
      onChange(nouvelleValeur);
    } else {
      setValeurInterne(nouvelleValeur);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && onSubmit) {
      onSubmit(valeurAffichee);
    }
  }

  return (
    <div className="relative flex items-stretch">
      <input
        type="search"
        value={valeurAffichee}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-45 rounded-full relative m-0 block rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  );
}
