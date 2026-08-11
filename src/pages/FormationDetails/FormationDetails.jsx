import { useParams } from "react-router-dom";

function FormationDetails() {
  const { slug } = useParams();

  return (
    <main className="formation-details-page">

      {/* HERO DE LA FORMATION */}

      <section className="formation-details-hero">

        <div className="container">

          <div className="formation-breadcrumb">
            Accueil
            <i className="bi bi-chevron-right"></i>
            Formations
            <i className="bi bi-chevron-right"></i>
            {slug}
          </div>

          <div className="row align-items-end g-5">

            <div className="col-lg-8">

              <span className="details-category">
                Génie civil
              </span>

              <h1>
                Architecture &
                <span> conception</span>
              </h1>

              <p>
                Développez vos compétences en architecture,
                conception et utilisation des outils professionnels
                nécessaires aux projets de construction.
              </p>

            </div>


            <div className="col-lg-4">

              <div className="formation-info-card">

                <div>
                  <span>Durée</span>
                  <strong>3 mois</strong>
                </div>

                <div>
                  <span>Niveau</span>
                  <strong>Débutant → Avancé</strong>
                </div>

                <div>
                  <span>Format</span>
                  <strong>Présentiel</strong>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* CONTENU */}

      <section className="formation-details-content">

        <div className="container">

          <div className="row g-5">

            <div className="col-lg-8">

              <div className="formation-content-block">

                <span className="content-label">
                  Présentation
                </span>

                <h2>
                  Une formation pensée pour le terrain.
                </h2>

                <p>
                  Cette formation permet aux apprenants de
                  développer des compétences pratiques et
                  professionnelles adaptées aux exigences
                  du secteur du bâtiment et de la construction.
                </p>

              </div>


              {/* PROGRAMME */}

              <div className="formation-content-block">

                <span className="content-label">
                  Programme
                </span>

                <h2>
                  Ce que vous allez apprendre
                </h2>

                <div className="program-list">

                  <div>
                    <span>01</span>
                    <strong>Introduction à l'architecture</strong>
                    <i className="bi bi-arrow-up-right"></i>
                  </div>

                  <div>
                    <span>02</span>
                    <strong>Lecture et réalisation de plans</strong>
                    <i className="bi bi-arrow-up-right"></i>
                  </div>

                  <div>
                    <span>03</span>
                    <strong>Conception de projets</strong>
                    <i className="bi bi-arrow-up-right"></i>
                  </div>

                  <div>
                    <span>04</span>
                    <strong>Outils professionnels</strong>
                    <i className="bi bi-arrow-up-right"></i>
                  </div>

                </div>

              </div>


              {/* COURS PDF */}

              <div className="course-document">

                <div className="document-icon">
                  <i className="bi bi-file-earmark-pdf"></i>
                </div>

                <div>
                  <span>Support de formation</span>

                  <strong>
                    Cours Architecture & conception
                  </strong>

                  <small>
                    Le document sera disponible prochainement.
                  </small>
                </div>

              </div>

            </div>


            {/* INSCRIPTION */}

            <div className="col-lg-4">

              <aside className="registration-card">

                <span className="content-label">
                  Inscription
                </span>

                <h2>
                  Rejoignez cette formation.
                </h2>

                <p>
                  Vous souhaitez participer à cette formation ?
                  Envoyez-nous vos informations.
                </p>

                <a
                  href="https://wa.me/242064490583"
                  target="_blank"
                  rel="noreferrer"
                  className="registration-whatsapp"
                >
                  <i className="bi bi-whatsapp"></i>

                  S'inscrire via WhatsApp

                  <i className="bi bi-arrow-up-right"></i>
                </a>

                <div className="registration-note">
                  <i className="bi bi-shield-check"></i>

                  Vos informations seront traitées
                  par notre équipe.
                </div>

              </aside>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default FormationDetails;