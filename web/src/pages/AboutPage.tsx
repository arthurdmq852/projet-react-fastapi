import Navbar from '../components/ui/Navbar/Navbar.tsx'
import Footer from '../components/ui/Footer/Footer.tsx'

export default function AboutPage() {
  return(
  <div>
    <Navbar/>
      <div>
        <form className="bg-white rounded-sm p-8 w-full max-w-sm flex flex-col gap-4">
          <h1 className="!text-red">
            C'est quoi un Chouffin
          </h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipiscing elit. 
              Placerat in id cursus mi pretium tellus duis. 
              Urna tempor pulvinar vivamus fringilla lacus nec metus. 
              Integer nunc posuere ut hendrerit semper vel class. 
              Conubia nostra inceptos himenaeos orci varius natoque penatibus. 
              Mus donec rhoncus eros lobortis nulla molestie mattis. 
              Purus est efficitur laoreet mauris pharetra vestibulum fusce. 
              Sodales consequat magna ante condimentum neque at luctus.
              Ligula congue sollicitudin erat viverra ac tincidunt nam.
              Lectus commodo augue arcu dignissim velit aliquam imperdiet. 
              Cras eleifend turpis fames primis vulputate ornare sagittis. 
              Libero feugiat tristique accumsan maecenas potenti ultricies habitant. 
            </p>
        </form>
      </div>
    <Footer/>
  </div>
  );
}
