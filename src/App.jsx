
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Inscription from "./page/inscription";
import FormationDetails from "./pages/FormationDetails/FormationDetails";
import Login from "./Login/Login";
import Dashboard from "./dashboard/dashboard";

// Administration
import AdminDashboard from "./admin/AdminDashboard";
import StudentProfile from "./admin/studentprofile";
import RequireAdmin from "./components/RequireAdmin";

// Composants du site
import Navbar from "./components/navbar/navbar";
import Hero from "./components/Hero/Hero";
import Leadership from "./components/Leadership/Leadership";
import About from "./components/About/About";
import Formation from "./components/formations/formations";
import RegistrationCTA from "./components/RegistrationCTA/RegistrationCTA";
import Testimonials from "./components/Testimonials/Testimonials";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";

// Protection des routes
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PAGE D'ACCUEIL */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
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

        {/* PAGE FORMATION */}
        <Route
          path="/formation/:slug"
          element={
            <>
              <Navbar />
              <FormationDetails />
            </>
          }
        />

        {/* INSCRIPTION */}
        <Route
          path="/inscription"
          element={
            <>
              <Navbar />
              <Inscription />
            </>
          }
        />

        {/* CONNEXION */}
        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <Login />
            </>
          }
        />

        {/* ESPACE ÉTUDIANT */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Navbar />
              <Dashboard />
            </RequireAuth>
          }
        />

        {/* TABLEAU DE BORD ADMIN */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />

        {/* FICHE INDIVIDUELLE D'UN ÉTUDIANT */}
        <Route
          path="/admin/inscriptions/:id"
          element={
            <RequireAdmin>
              <StudentProfile />
            </RequireAdmin>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
