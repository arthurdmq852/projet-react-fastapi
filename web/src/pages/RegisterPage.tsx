import Navbar from '../components/ui/Navbar/Navbar.tsx'
import Footer from '../components/ui/Footer/Footer.tsx'
import RegisterComponent from '../components/auth/RegisterComponent.tsx'

export default function RegisterPage() {
  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden h-full">
      <Navbar/>
      <div className="flex-1 min-h-0">
        <RegisterComponent/>
      </div>
      <Footer/>
    </div>
  );
}
