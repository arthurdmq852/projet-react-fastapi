import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom';
import Button from '../Button/Button.tsx';
import SearchBar from '../SearchBar/SearchBar.tsx';
import { useAuth } from '../../../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  function handleSearch(terme: string) {
    navigate(`/catalogue${terme ? `?q=${encodeURIComponent(terme)}` : ''}`);
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/"><img src="/chouffin_chapeau.jpg" width={70} height={70} alt="" />Chouffins Marketplace</Link>
      </div>

      <div className="navbar-center">
        <ul className="nav-links">
          <li>
            <Link to="/catalogue">Catalogue</Link>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <Link to="/collection">Ma collection</Link>
              </li>
              <li>
                <Link to="/stats">Statistiques</Link>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="navbar-right">
        {isAuthenticated ? (
          <>
            {user && <span className="text-white text-sm">{user.email}</span>}
            <Button variant="blue" onClick={handleLogout}>
              Déconnexion
            </Button>
          </>
        ) : (
          <Button variant="blue" onClick={() => navigate("/login")}>
            Connexion
          </Button>
        )}
        <SearchBar onSubmit={handleSearch} />
      </div>
    </nav>
  );
}
