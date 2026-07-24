import Navbar from "../components/Navbar";
import PageRenderer from "../components/PageRenderer";
import WhatsAppButton from "../components/WhatsAppButton";
import { PageRepository } from "../domain/repositories/PageRepository";

export default function Home() {

  const page = PageRepository.getHome();

  return (
    <div className="px-4 md:px-16 pt-20 lg:px-32">

      <Navbar />

      <PageRenderer sections={page.sections} />

      <WhatsAppButton />

    </div>
  );

}


// import Navbar from '../components/Navbar'
// import Hero from '../components/Hero'
// import Feature from '../components/Feature'
// import ServicosPremium from '../components/ServicosPremium'
// import About from '../components/About'
// import Contact from '../components/Contact'
// import WhatsAppButton from '../components/WhatsAppButton'

// const Home = () => {
//   return (
//     <div className="px-4 md:px-16 pt-20 lg:px-32 ">
//       <Navbar/>
//       <section id="home" >
//         <Hero/>  
//       </section>
//       <section id="servicos">
//       <Feature/>
//       </section>
//         <ServicosPremium/>
//       <section id="sobre" >
//         <About/>
//       </section>
//       <section id="contato" >
//         <Contact/>  
//       </section>
//       <WhatsAppButton/>
//     </div>
//   )
// }

// export default Home