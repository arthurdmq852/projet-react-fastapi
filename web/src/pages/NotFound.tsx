import Navbar from '../components/ui/Navbar/Navbar.tsx'
import Footer from '../components/ui/Footer/Footer.tsx'
import Button from '../components/ui/Button/Button.tsx'
import { useNavigate } from 'react-router-dom';
import chouffinChapeau from '/chouffin_chapeau.avif'

export default function NotFound() {
  const navigate = useNavigate();
  return(
    <div>
      <Navbar/>
      <div className="mx-auto flex max-w-96 flex-col items-center text-center gap-6">
        <h1 className="text-white">Erreur 404</h1>
        <img 
          src={chouffinChapeau} 
          className="rounded-md"/>

        <p className="text-gray">Page Introuvable, vérifiez l'URL</p>
        <Button variant="blue" onClick={() => navigate("/")}>Retour à l'accueil</Button>
      </div>
      <Footer/>
    </div>
  );
}
