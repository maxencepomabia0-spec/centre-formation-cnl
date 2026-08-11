import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar/navbar";
import Hero from "./components/Hero/Hero";
import Leadership from "./components/Leadership/Leadership";
import Formation from "./components/formations/formations";

import FormationDetails from "./pages/FormationDetails/FormationDetails";

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
              <Formation />
            </>
          }
        />

        {/* PAGE D'UNE FORMATION */}
        <Route
          path="/formation/:slug"
          element={<FormationDetails />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;