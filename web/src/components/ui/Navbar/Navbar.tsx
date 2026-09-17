import './Navbar.css'

export default function Navbar() {
  return(
    <nav className="navbar">
      <div className="navbar-left">
        <a href="/">
          Chouffin's Paradise 
        </a>
      </div>

      <div className="navbar-center">
        <ul className="nav-links">
          <li>
            <a href="/">Catalogue</a>
          </li>
          <li>
            <a href="/">A Propos</a>
          </li>
          <li>
            <a href="/">Contact</a>
          </li>
        </ul>
      </div>

      <div className="navbar-right">
        <a href="/Login">Login</a>
        <a href="/Register">Register</a>
      </div>

    </nav>
  );
}
