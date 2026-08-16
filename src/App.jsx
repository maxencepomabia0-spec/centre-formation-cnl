import { BrowserRouter, Routes, Route } from "react-router-dom";

import Inscription from "./page/inscription";
import Navbar from "./components/navbar/navbar";
import Hero from "./components/Hero/Hero";
import Leadership from "./components/Leadership/Leadership";
import Formation from "./components/formations/formations";

import FormationDetails from "./pages/FormationDetails/FormationDetails";
import RegistrationCTA from "./components/RegistrationCTA/RegistrationCTA";
import Testimonials from "./components/Testimonials/Testimonials";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>
        

        {/* PAGE D'ACCUEIL */}
        <Route
  path="/"
  element={
    <>
      <Hero />

      <Leadership />

      <RegistrationCTA />

        <Formation />
        <Testimonials />
                <Contact />
         <Footer />
        
    </>
  }
/>

        {/* PAGE D'UNE FORMATION */}
        <Route
          path="/formation/:slug"
          element={<FormationDetails />}
        />
<Route
  path="/inscription"
  element={<Inscription />}
/>
      </Routes>

    </BrowserRouter>
  );
}

export default App;