import { Link } from "react-router-dom";

function RegistrationCTA() {
  return (
    <section className="registration-cta">

      <div className="registration-cta-glow"></div>

      <div className="container">

        <div className="registration-cta-inner">

          <div className="registration-cta-content">

            <span className="registration-cta-label">
              // INSCRIPTION CNL
            </span>

            <h2>
              Prêt à construire
              <span> votre avenir ?</span>
            </h2>

            <p>
              Rejoignez une formation professionnelle et développez
              des compétences directement applicables dans votre domaine.
            </p>

          </div>


          <div className="registration-cta-actions">

            <Link
              to="/inscription"
              className="registration-cta-primary"
            >
              Je m'inscris
              <i className="bi bi-arrow-up-right"></i>
            </Link>

            <a
              href="https://wa.me/242064490583"
              target="_blank"
              rel="noreferrer"
              className="registration-cta-whatsapp"
            >
              <i className="bi bi-whatsapp"></i>
              WhatsApp
            </a>

          </div>

        </div>

      </div>

    </section>
  );
}

export default RegistrationCTA;