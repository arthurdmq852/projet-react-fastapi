import { useState } from 'react';
import Button from '../ui/Button/Button.tsx';
import { useNavigate } from 'react-router';

export default function LoginComponent() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [birthday, setBirthday] = useState(0);
  const [error, setError] = useState("");
  let navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !name || !lastName || !birthday || !password || !passwordConfirmation) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setError("");
  }

  return (
    <div>
      <form className="max-w-full bg-white rounded-xl shadow">
        <a className="text-black text-bold">Prénom</a>
        <input
          type="Prénom"
          placeholder="Prénom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-xl px-4 py-2 bg-white text-gray placeholder-gray-400 border-2 border-gray-400 outline-none focus:outline-2 focus:outline-blue-500"
        />
 
        <a className="text-black text-bold">Nom</a>
        <input
          type="Nom"
          placeholder="Nom"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="rounded-xl px-4 py-2 bg-white text-gray placeholder-gray-400 border-2 border-gray-000 outline-none focus:outline-2 focus:outline-blue-500"
        />

        <a className="text-black text-bold">Date d'Anniversaire</a>
        <input
          type="Anniversaire"
          placeholder="Anniversaire"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          className="rounded-xl px-4 py-2 bg-white text-gray placeholder-gray-400 border-2 border-gray-400 outline-none focus:outline-2 focus:outline-blue-500"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl px-4 py-2 bg-white text-gray placeholder-gray-400 border-2 outline-none focus:outline-2 focus:outline-blue-500"
        />

        <a className="text-black text-bold">Mot de Passe</a>
        <input
          type="password"
          placeholder="Mot de passe"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          className="rounded-xl px-4 py-2 bg-white text-gray placeholder-gray-400 border-2 outline-none focus:outline-2 focus:outline-blue-500"
        />

        <Button variant="blue" onClick>
          S'inscrire 
        </Button>
      
        <Button variant="white" onClick={() => navigate("/login")}>
          J'ai déjà un compte 
        </Button>
      </form>
    </div>
  );
}
