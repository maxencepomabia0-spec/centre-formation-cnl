import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">

      <div className="container">

        <div className="footer-grid">

          <div className="footer-brand">

            <img
              src="/logo-cnl.png.jpeg"
              alt="CNL"
              className="footer-logo"
            />

            <h3>
              CLUB NATIONAL
              <span>DE LOGICIELS</span>
            </h3>

            <p>
              La maîtrise numérique au service
              de la construction.
            </p>

          </div>


          <div>

            <h4>Navigation</h4>

            <nav className="footer-links">

              <a href="#formations">
                Formations
              </a>

              <a href="#temoignages">
                Témoignages
              </a>

              <a href="#contact">
                Contact
              </a>

              <Link to="/inscription">
                Inscription
              </Link>

            </nav>

          </div>


          <div>

            <h4>Communauté</h4>

            <nav className="footer-links">

              <a href="#formations">
                Génie Civil
              </a>

              <a href="#formations">
                Architecture
              </a>

              <a href="#formations">
                BIM
              </a>

              <a href="#formations">
                Gestion de projets
              </a>

            </nav>

          </div>


          <div>

            <h4>Contact</h4>

            <p className="footer-contact">
              Brazzaville
              <br />
              République du Congo
              <br /><br />
              +242 06 449 05 83
            </p>

            <a
              href="https://wa.me/242064490583"
              target="_blank"
              rel="noreferrer"
              className="footer-whatsapp"
            >
              <i className="bi bi-whatsapp"></i>
              WhatsApp
            </a>

          </div>

        </div>


        <div className="footer-bottom">

          <span>
            © 2026 Club National de Logiciels & Génie Civil
          </span>

          <span>
            Tous droits réservés
          </span>

        </div>

      </div>

    </footer>
  );
}

export default Footer;