import { useParams, Link } from "react-router-dom";
import formations from "../../data/formations";
import "./FormationDetails.css";

function FormationDetails() {

  const { slug } = useParams();

  const formation = formations.find(
    (item) => item.slug === slug
  );

  if (!formation) {
    return (
      <main className="formation-not-found">
        <div>
          <span>404</span>
          <h1>Formation introuvable</h1>

          <p>Slug demandé: <strong>{slug}</strong></p>

          <p>Slugs disponibles: <strong>{formations.map(f => f.slug).join(", ")}</strong></p>

          <Link to="/" className="back-home">
            Retour à l'accueil
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="formation-details">

      {/* ==============================
          HERO
      ============================== */}

      <section className="formation-hero">

        <div className="formation-hero-grid"></div>

        <div className="container">

          <div className="formation-breadcrumb">

            <Link to="/">
              Accueil
            </Link>

            <i className="bi bi-chevron-right"></i>

            <Link to="/#formations">
              Formations
            </Link>

            <i className="bi bi-chevron-right"></i>

            <span>
              {formation.title}
            </span>

          </div>


          <div className="row align-items-end formation-hero-row">

            <div className="col-lg-8">

              <div className="formation-label">

                <span className="formation-line"></span>

                {formation.filiere}

              </div>


              <h1>
                {formation.title}
              </h1>


              <p className="formation-intro">
                Formation professionnelle du Club National
                de Logiciels &amp; Génie Civil.
              </p>

            </div>


            <div className="col-lg-4">

              <div className="formation-code">

                <span>CODE</span>

                <strong>
                  {formation.code}
                </strong>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ==============================
          INFORMATIONS
      ============================== */}

      <section className="formation-meta-section">

        <div className="container">

          <div className="formation-meta-grid">

            <div className="meta-card">

              <span>VERSION</span>

              <strong>
                {formation.version}
              </strong>

            </div>


            <div className="meta-card">

              <span>NIVEAU</span>

              <strong>
                {formation.level}
              </strong>

            </div>


            <div className="meta-card">

              <span>DURÉE</span>

              <strong>
                {formation.duration}
              </strong>

            </div>


            <div className="meta-card meta-icon">

              <i className={`bi ${formation.icon}`}></i>

            </div>

          </div>

        </div>

      </section>


      {/* ==============================
          LOGICIELS
      ============================== */}

      <section className="formation-content">

        <div className="container">

          <div className="row g-5">

            <div className="col-lg-8">

              <div className="content-heading">

                <span>
                  // LOGICIELS ENSEIGNÉS
                </span>

                <h2>
                  Les outils que vous allez maîtriser.
                </h2>

              </div>


              <div className="software-list">

                {formation.logiciels.map((logiciel, index) => (

                  <div
                    className="software-item"
                    key={logiciel}
                  >

                    <span className="software-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <strong>
                      {logiciel}
                    </strong>

                    <i className="bi bi-arrow-up-right"></i>

                  </div>

                ))}

              </div>

            </div>


            {/* ==============================
                INSCRIPTION
            ============================== */}

            <div className="col-lg-4">

              <aside className="formation-action">

                <span className="action-label">
                  REJOINDRE LA FORMATION
                </span>

                <h2>
                  Prêt à commencer ?
                </h2>

                <p>
                  Inscrivez-vous auprès du CNL pour
                  rejoindre cette filière.
                </p>


                <Link
                  to={`/inscription?formation=${formation.slug}`}
                  className="action-button"
                >

                  Je m'inscris

                  <i className="bi bi-arrow-up-right"></i>

                </Link>


                <a
                  href="https://wa.me/242064490583"
                  target="_blank"
                  rel="noreferrer"
                  className="whatsapp-button"
                >

                  <i className="bi bi-whatsapp"></i>

                  Contacter sur WhatsApp

                </a>


                <div className="action-note">

                  <i className="bi bi-shield-check"></i>

                  <span>
                    L'accès aux supports de cours est
                    réservé aux membres validés par le centre.
                  </span>

                </div>

              </aside>

            </div>

          </div>


          {/* ==============================
              COURS
          ============================== */}

          <div className="course-access">

            <div className="course-icon">

              <i className="bi bi-file-earmark-pdf"></i>

            </div>


            <div className="course-info">

              <span>
                SUPPORT DE FORMATION
              </span>

              <strong>
                Cours {formation.title}
              </strong>

              <small>
                Accès réservé aux membres validés.
              </small>

            </div>


            <div className="course-lock">

              <i className="bi bi-lock-fill"></i>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default FormationDetails;