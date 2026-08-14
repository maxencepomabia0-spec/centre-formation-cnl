import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
      <div className="container">

        <a className="navbar-brand" href="#">
  <img
    src="/logo-cnl.png.jpeg"
    alt="Club National de Logiciels & Génie Civil"
    className="navbar-logo"
  />
</a>
          
      

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Ouvrir le menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto align-items-lg-center">

            <li className="nav-item">
              <a className="nav-link" href="#accueil">
                Accueil
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#formations">
                Formations
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#apropos">
                À propos
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#contact">
                Contact
              </a>
            </li>

            <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
              <Link
                className="btn btn-warning fw-semibold px-4"
                to="/inscription"
              >
                S'inscrire
              </Link>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;