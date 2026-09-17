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
            <a href="/catalogue">Catalogue</a>
          </li>
          <li>
            <a href="/about">A Propos</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </div>

     <div className="navbar-right flex items-center gap-3">
        <a href="/Login" className="rounded-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 active:bg-blue-700">
          Connexion
        </a>

        <div className="relative flex items-stretch">
          <input
            type="search"
            className="rounded-full relative m-0 block rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
            placeholder="Search"
            aria-label="Search"
            aria-describedby="button-addon2"/>
        </div>
    </div>
  </nav>
  );
}
