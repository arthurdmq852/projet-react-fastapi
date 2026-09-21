import Navbar from '../components/ui/Navbar/Navbar.tsx'
import Button from '../components/ui/Button/Button.tsx'
import Footer from '../components/ui/Footer/Footer.tsx'
import RegisterComponent from '../components/auth/RegisterComponent.tsx'

export default function RegisterPage() {
  return(
  <div>
    <Navbar/>
    <RegisterComponent/>
    <Footer/>
  </div>
  );
}
