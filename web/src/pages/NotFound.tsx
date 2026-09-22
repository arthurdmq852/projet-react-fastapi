import Navbar from '../components/ui/Navbar/Navbar.tsx'
import Footer from '../components/ui/Footer/Footer.tsx'
import Button from '../components/ui/Button/Button.tsx'
import { useNavigate } from 'react-router-dom';
import chouffinChapeau from '/chouffin_chapeau.avif'

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden h-full">
      <Navbar/>
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-center gap-4 px-4 pb-24">
        <h1 className="text-white text-6xl md:text-5xl font-bold">Erreur 404</h1>
        <img
          src={chouffinChapeau}
          className="rounded-md max-w-[420px] w-full"
        />
        <p className="text-gray-400 text-xl mt-4">Page Introuvable, vérifiez l'URL</p>
        <Button variant="blue" onClick={() => navigate("/")}>Retour à l'accueil</Button>
      </div>
      <Footer/>
    </div>
  );
}
