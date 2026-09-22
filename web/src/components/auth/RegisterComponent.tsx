import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button/Button.tsx';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../services/httpClient';

export default function RegisterComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password || !passwordConfirmation) {
      setError("Merci de remplir tous les champs.");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await register(email, password);
      navigate("/collection");
    } catch (err) {
      if (err instanceof ApiError && err.code === 409) {
        setError("Un compte existe déjà avec cet email.");
      } else {
        setError(err instanceof Error ? err.message : "Échec de l'inscription.");
      }
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
          Créer un compte
        </a>
        <p>Chouffins Marketplace</p>

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

        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          className="rounded-xl px-4 py-2 bg-white text-gray placeholder-gray-400 border-2 outline-none focus:outline-2 focus:outline-blue-500"
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <Button variant="blue" type="submit" disabled={loading}>
          {loading ? "Inscription..." : "S'inscrire"}
        </Button>

        <Button variant="white" type="button" onClick={() => navigate("/login")}>
          J'ai déjà un compte
        </Button>
      </form>
    </div>
  );
}
