import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../Button/Button.tsx';
import SearchBar from '../SearchBar/SearchBar.tsx';
import { useAuth } from '../../../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  function handleSearch(terme: string) {
    closeMenu();
    navigate(`/catalogue${terme ? `?q=${encodeURIComponent(terme)}` : ''}`);
  }

  function handleLogout() {
    logout();
    closeMenu();
    navigate('/');
  }

  function handleLogin() {
    closeMenu();
    navigate('/login');
  }

  return (
    <nav className="flex flex-wrap items-center justify-between gap-6 px-4 py-2 text-white md:grid md:grid-cols-[1fr_auto_1fr] md:px-6">
      {/* Left: logo */}
      <div className="md:justify-self-start">
        <Link to="/" onClick={closeMenu} className="flex items-center gap-3 font-bold">
          <img src="/chouffin_chapeau.jpg" width={70} height={70} alt="" />
          CHF Marketplace
        </Link>
      </div>

      {/* Burger (phone only) */}
      <button
        type="button"
        aria-label="Menu"
        aria-expanded={menuOpen}
        aria-controls="navbar-menu"
        onClick={() => setMenuOpen((open) => !open)}
        className="flex flex-col gap-[5px] p-2 md:hidden"
      >
        <span
          className={`block h-[3px] w-[26px] rounded bg-white transition-all duration-300 ${
            menuOpen ? 'translate-y-2 rotate-45' : ''
          }`}
        />
        <span
          className={`block h-[3px] w-[26px] rounded bg-white transition-all duration-300 ${
            menuOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`block h-[3px] w-[26px] rounded bg-white transition-all duration-300 ${
            menuOpen ? '-translate-y-2 -rotate-45' : ''
          }`}
        />
      </button>

      <div
        id="navbar-menu"
        className={`${
          menuOpen ? 'flex' : 'hidden'
        } w-full flex-col items-start gap-4 pb-4 md:contents`}
      >

        <ul className="flex list-none flex-col gap-3 p-0 md:flex-row md:justify-self-center md:gap-6">  
          <li>
            <Link to="/catalogue" onClick={closeMenu}>Catalogue</Link>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <Link to="/collection" onClick={closeMenu}>Ma collection</Link>
              </li>
              <li>
                <Link to="/stats" onClick={closeMenu}>Statistiques</Link>
              </li>
            </>
          )}
        </ul>

        <div className="flex w-full flex-col items-start gap-3 md:w-auto md:flex-row md:items-center md:justify-self-end md:gap-4">
          {isAuthenticated ? (
            <>
              {user && <span className="text-sm text-white">{user.email}</span>}
              <Button variant="blue" onClick={handleLogout}>
                Déconnexion
              </Button>
            </>
          ) : (
            <Button variant="blue" onClick={handleLogin}>
              Connexion
            </Button>
          )}
          <SearchBar onSubmit={handleSearch} />
        </div>
      </div>
    </nav>
  );
}
