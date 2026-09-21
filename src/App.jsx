import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Inscription from "./page/inscription";
import FormationDetails from "./pages/FormationDetails/FormationDetails";
import Login from "./Login/Login";
import Dashboard from "./dashboard/dashboard";

// Components
import Navbar from "./components/navbar/navbar";
import Hero from "./components/Hero/Hero";
import Leadership from "./components/Leadership/Leadership";
import About from "./components/About/About";
import Formation from "./components/formations/formations";
import RegistrationCTA from "./components/RegistrationCTA/RegistrationCTA";
import Testimonials from "./components/Testimonials/Testimonials";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* ========================= */}
        {/* PAGE D'ACCUEIL            */}
        {/* ========================= */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Leadership />
              <About />
              <Formation />
              <RegistrationCTA />
              <Testimonials />
              <Contact />
              <Footer />
            </>
          }
        />

        {/* ========================= */}
        {/* PAGE D'UNE FORMATION      */}
        {/* ========================= */}
        <Route
          path="/formation/:slug"
          element={<FormationDetails />}
        />

        {/* ========================= */}
        {/* PAGE INSCRIPTION           */}
        {/* ========================= */}
        <Route
          path="/inscription"
          element={<Inscription />}
        />

        {/* ========================= */}
        {/* PAGE CONNEXION             */}
        {/* ========================= */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* ========================= */}
        {/* DASHBOARD                  */}
        {/* ========================= */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;