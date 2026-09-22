import Navbar from '../components/ui/Navbar/Navbar.tsx'
import Footer from '../components/ui/Footer/Footer.tsx'
import LoginComponent from '../components/auth/LoginComponent.tsx'

export default function LoginPage() {
  return(
  <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
    <Navbar/>
    <div className="flex-1 min-h-0">
      <LoginComponent/>
    </div>
    <Footer/>
  </div>
  );
}
