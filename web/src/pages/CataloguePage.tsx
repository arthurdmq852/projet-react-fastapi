import Navbar from '../components/ui/Navbar/Navbar.tsx'
import Footer from '../components/ui/Footer/Footer.tsx'

export default function CataloguePage() {
  return(
  <div>
    <Navbar />
      <div>
        <h1 className="text-4xl font-bold text-white">Découvrir de nouveaux jeux</h1>
      </div>
    <Footer />
  </div>
  );
}
