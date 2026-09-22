import { useState } from 'react';
import { useNavigate } from 'react-router';
import Button from '../ui/Button/Button.tsx';
import { useAuth } from '../../context/AuthContext'; // adapte le chemin si besoin

export default function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      setError("Merci de remplir tous les champs.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/collection");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de la connexion.");
    } finally {
      setLoading(false);
    }
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

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <Button variant="blue" type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se Connecter"}
        </Button>

        <Button variant="white" type="button">
          Mot de passe oublié ?
        </Button>

        <Button variant="blueInverted" type="button" onClick={() => navigate("/register")}>
          Créer un nouveau compte
        </Button>
      </form>
    </div>
  );
}
