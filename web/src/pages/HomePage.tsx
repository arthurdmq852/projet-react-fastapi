import { Link } from 'react-router-dom'
import Navbar from '../components/ui/Navbar/Navbar.tsx'
import Footer from '../components/ui/Footer/Footer.tsx'

export default function HomePage() {
  return(
  <div>
    <Navbar/>
      <div className="items-center w-1/2 self-center">
        <h1 className="text-white items-left text-left" >Selon votre collection</h1>
        <p className="text-white items-left text-left">Votre collection</p>
        <Link to="/catalogue" className="text-left">Découvrir de nouveaux jeux</Link>
      </div>
    <Footer/>
  </div>
  );
}
