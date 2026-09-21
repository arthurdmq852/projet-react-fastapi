import Navbar from '../components/ui/Navbar/Navbar.tsx'
import Footer from '../components/ui/Footer/Footer.tsx'

export default function AboutPage() {
  return(
  <div>
    <Navbar/>
      <div className="flex justify-center items-center">
        <form className="bg-white rounded-xl p-8 w-full max-w-xl flex flex-col">
          <h1 className="text-4xl font-bold !text-gray-400">
            C'est quoi un Chouffin
          </h1>
            <p>
            Chouffin est un terme inventé sur le forum 18-25 désignant un stéréotype de geek ayant un physique ingrat, barbu, 
            en surpoids et malpropre, beauf sur les bords, et fan d'une culture populaire mainstream comme Le Seigneur des Anneaux, 
            World of Warcraft, et surtout la série Kaamelott. <br /> <br/>
            En tant qu'amateur d'alcool, le chouffin consomme à profusion des bières, telles que la chouffe, d'où provient son sobriquet. 
            </p>
        </form>
      </div>
    <Footer/>
  </div>
  );
}
