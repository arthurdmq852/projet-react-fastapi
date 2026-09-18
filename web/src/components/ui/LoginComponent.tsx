import { useState } from 'react';
import Button from './Button.tsx';

export default function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      setError("Merci de remplir tous les champs.");
      return;
    }

    setError("");
    console.log("Login avec :", { email, password });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4"
      >

      <a className="!text-black font-semibold text-center mb-2">
        Se connecter à Chouffins Marketplace 
      </a>
      
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-xl px-4 py-2 bg-white text-gray placeholder-gray-400 border-2 border-gray-000 outline-none focus:outline-2 focus:outline-blue-500"
      />

      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="rounded-xl px-4 py-2 bg-white text-gray placeholder-gray-400 border-2 outline-none focus:outline-2 focus:outline-blue-500"
      />

      <Button variant="blue" onClick>
        Se Connecter
      </Button>
      
      <Button variant="white">
        Mot de passe oublié ?
      </Button>
          
      <Button variant="blueInverted">
        Créer un nouveau compte
      </Button>
    </form>
  </div>
  );
}
