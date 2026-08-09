function Hero() {
  return (
    <section className="hero" id="accueil">
        <div className="hero-logo-watermark">
  <img
    src="/logo-cnl.png.jpeg"
    alt=""
  />
</div>

      {/* Lueur décorative */}
      <div className="hero-glow hero-glow-one"></div>
      <div className="hero-glow hero-glow-two"></div>

      <div className="container hero-container">
        <div className="row align-items-center">

          {/* =========================
              PARTIE GAUCHE
          ========================== */}
          <div className="col-lg-6">

            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              Centre de formation professionnelle
            </div>

            <h1 className="hero-title">
              Maîtrisez les outils
              <span> du BTP.</span>
            </h1>

            <p className="hero-description">
              Développez vos compétences en logiciels, génie civil
              et outils numériques grâce à des formations pratiques
              adaptées aux réalités du terrain.
            </p>

            <div className="hero-actions">

              <a
                href="#formations"
                className="hero-btn hero-btn-primary"
              >
                Découvrir les formations
                <i className="bi bi-arrow-up-right"></i>
              </a>

              <a
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer"
                className="hero-btn hero-btn-whatsapp"
              >
                <i className="bi bi-whatsapp"></i>
                Nous contacter
              </a>

            </div>

            {/* Statistiques */}
            <div className="hero-stats">

              <div className="hero-stat">
                <strong>500<span>+</span></strong>
                <small>Apprenants</small>
              </div>

              <div className="hero-stat">
                <strong>15<span>+</span></strong>
                <small>Formations</small>
              </div>

              <div className="hero-stat">
                <strong>95<span>%</span></strong>
                <small>Satisfaction</small>
              </div>

            </div>

          </div>


          {/* =========================
              PARTIE DROITE
          ========================== */}
          <div className="col-lg-6">

            <div className="hero-visual">

              {/* Grille architecturale */}
              <div className="hero-grid"></div>

              {/* Cercle décoratif */}
              <div className="hero-circle"></div>

              {/* Image principale */}
              <div className="hero-image-wrapper">

                <img
                  src="/hero-building.jpg.jpeg"
                  alt="Formation en génie civil"
                  className="hero-image"
                />

                <div className="hero-image-overlay"></div>

              </div>


              {/* Carte flottante */}
              <div className="hero-floating-card">

                <div className="hero-floating-icon">
                  <i className="bi bi-building"></i>
                </div>

                <div className="hero-floating-content">
                  <strong>Génie civil</strong>
                  <span>Formation pratique</span>
                </div>

                <div className="hero-floating-check">
                  <i className="bi bi-check-lg"></i>
                </div>

              </div>


              {/* Petite carte supérieure */}
              <div className="hero-mini-card">

                <i className="bi bi-rulers"></i>

                <div>
                  <strong>Compétences</strong>
                  <span>Orientées terrain</span>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Indicateur de scroll */}
      <div className="hero-scroll">
        <span></span>
        <small>Défiler</small>
      </div>

    </section>
  );
}

export default Hero;