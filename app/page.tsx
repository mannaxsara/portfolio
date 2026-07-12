import Hero from "./sections/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Gallery from "./sections/Gallery";
import Experience from "./sections/Experience";
import Contact from "./sections/Contact";
import Preloader from "./components/Preloader";

const Home = () => {
  return (
    <main>
      {/* <Preloader /> */}
      <section id="home">
        <Hero />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="projects">
        <Projects />
      </section>
      <section id="gallery">
        <Gallery />
      </section>
      <section id="experience">
        <Experience />
      </section>
      <section id="contact">
        <Contact />
      </section>
    </main>
  );
};

export default Home;