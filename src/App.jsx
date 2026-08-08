import Navbar from "./components/navbar/navbar";
import Hero from "./components/Hero/Hero";

function App() {
  return (
    <>
      <Navbar />

    <Hero />
    
      <main>
        <section
          id="accueil"
          className="min-vh-100 d-flex align-items-center justify-content-center"
        >
          <h1>Centre National de Leadership</h1>
        </section>
      </main>
    </>
  );
}

export default App;