import Navbar from '../components/ui/Navbar/Navbar.tsx'
import Footer from '../components/ui/Footer/Footer.tsx'
import LoginComponent from '../components/auth/LoginComponent.tsx'

export default function HomePage() {
  return(
  <div>
    <Navbar/>
      <LoginComponent/>
    <Footer/>
  </div>
  );
}
