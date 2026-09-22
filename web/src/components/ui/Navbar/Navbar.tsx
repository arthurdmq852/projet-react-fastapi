import './Navbar.css'
import { useNavigate } from 'react-router';
import Button from '../Button/Button.tsx';
import SearchBar from '../SearchBar/SearchBar.tsx';

export default function Navbar() {
  let navigate = useNavigate();

  return(
    <nav className="navbar" >
      <div className="navbar-left">
        <a href="/"><img src="/chouffin_chapeau.jpg" width={70} height={70}/>Chouffins Marketplace</a>
      </div>

      <div className="navbar-center">
        <ul className="nav-links">
          <li>
            <a href="/catalogue">Catalogue</a>
          </li>
          <li>
            <a href="/"></a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </div>

     <div className="navbar-right">
      <Button 
        variant="blue"
        onClick={() => navigate("/login")}>
          Connexion
      </Button>
      <SearchBar />
    </div>
  </nav>
  );
}
