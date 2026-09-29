import Navbar from '../components/ui/Navbar/Navbar.tsx'
import Footer from '../components/ui/Footer/Footer.tsx'
import Button from '../components/ui/Button/Button.tsx'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  let navigate = useNavigate();
  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden h-full">
      <Navbar/>
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-white text-3xl font-bold mb-6">Bienvenue sur CHF Marketplace</h1>
        <Button variant="blue"
          onClick={() => navigate("/catalogue")}
        >
          Découvrir les jeux du catalogue
        </Button>
      </div>
      
      <Footer/>
    </div>
  );
}
