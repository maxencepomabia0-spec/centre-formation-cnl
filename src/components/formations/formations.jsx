import { Link } from "react-router-dom";
import formations from "../../data/formations";

function Formations() {

  return (
    <section className="formations-section" id="formations">

      {/* =========================
          NUMÉRO ARRIÈRE-PLAN
      ========================== */}

      <div className="formations-background-number">
        04
      </div>


      <div className="container">

        {/* =========================
            EN-TÊTE
        ========================== */}

        <div className="formations-heading">

          <div>

            <div className="section-label">
              <span></span>
              Nos formations
            </div>

            <h2>
              Développez des compétences
              <span> qui construisent l'avenir.</span>
            </h2>

          </div>


          <p>
            Des formations qualifies certifie  professionnelles conçues pour
            développer des compétences directement applicables
            dans le secteur du génie civil, de l'architecture
            et de la gestion de projets. tout en respectons les regles du btp et du genie civil
          </p>

        </div>


        {/* =========================
            GRILLE DES FORMATIONS
        ========================== */}

        <div className="row g-3">

          {formations.map((formation, index) => (

            <div
              className="col-lg-6"
              key={formation.id}
            >

              <article className="formation-card">

                {/* TOP */}

                <div className="formation-card-top">

                  <div className="formation-icon">

                    <i className={`bi ${formation.icon}`}></i>

                  </div>


                  <span className="formation-number">

                    {String(index + 1).padStart(2, "0")}

                  </span>

                </div>


                {/* CONTENU */}

                <div className="formation-card-content">

                  <span className="formation-category">

                    {formation.filiere}

                  </span>


                  <h3>
                    {formation.title}
                  </h3>


                  <p>
                    Formation professionnelle orientée vers
                    la maîtrise des outils et compétences
                    nécessaires dans le domaine.
                  </p>

                </div>


                {/* META */}

                <div className="formation-meta">

                  <div>

                    <i className="bi bi-bar-chart"></i>

                    {formation.level}

                  </div>


                  <div>

                    <i className="bi bi-clock"></i>

                    {formation.duration}

                  </div>

                </div>


                {/* LOGICIELS */}

                <div className="formation-software-preview">

                  {formation.logiciels.slice(0, 3).map(
                    (logiciel) => (

                      <span key={logiciel}>
                        {logiciel}
                      </span>

                    )
                  )}

                  {formation.logiciels.length > 3 && (
                    <span>
                      +{formation.logiciels.length - 3}
                    </span>
                  )}

                </div>


                {/* LIEN */}

                <Link
                  to={`/formation/${formation.slug}`}
                  className="formation-link"
                >

                  Voir la formation

                  <span>

                    <i className="bi bi-arrow-up-right"></i>

                  </span>

                </Link>

              </article>

            </div>

          ))}

        </div>


        {/* =========================
            CTA
        ========================== */}

        <div className="formations-cta">

          <div>

            <span>
              Une formation spécifique vous intéresse ?
            </span>

            <strong>
              Contactez directement notre équipe.
            </strong>

          </div>


          <a
            href="https://wa.me/242064490583"
            target="_blank"
            rel="noreferrer"
            className="formations-cta-button"
          >

            Nous contacter

            <i className="bi bi-whatsapp"></i>

          </a>

        </div>

      </div>

    </section>
  );
}

export default Formations;