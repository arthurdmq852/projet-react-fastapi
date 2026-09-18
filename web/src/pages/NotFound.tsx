import Navbar from '../components/ui/Navbar/Navbar.tsx'
import Footer from '../components/ui/Footer/Footer.tsx'
import Button from '../components/ui/Button.tsx'

export default function NotFound() {
  return(
    <div>
      <Navbar/>
      <h1>Erreur 404</h1>
      <img src='/chouffin_chapeau.jpg'/>
      <h2>Page Introuvable, vérifiez l'URL</h2>
      <Button variant="blue">
        Retour à l'accueil
      </Button>
      <Footer/>
    </div>
  );
}
