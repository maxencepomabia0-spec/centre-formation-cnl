function Hero() {
  return (
    <section className="hero" id="accueil">

      <div className="container">
        <div className="row align-items-center min-vh-100">

          {/* CONTENU */}
          <div className="col-lg-6">

            <div className="hero-badge">
              <span></span>
              Formation professionnelle en génie civil
            </div>

            <h1 className="hero-title">
              Construisez
              <br />
              <span>l'avenir.</span>
            </h1>

            <p className="hero-description">
              Développez des compétences techniques solides
              grâce à des formations pratiques, modernes et
              orientées vers les réalités du terrain.
            </p>

            <div className="hero-actions">

              <a href="#formations" className="hero-btn hero-btn-primary">
                Découvrir les formations
                <i className="bi bi-arrow-up-right"></i>
              </a>

              <a
                href="https://wa.me/"
                className="hero-btn hero-btn-whatsapp"
                target="_blank"
                rel="noreferrer"
              >
                <i className="bi bi-whatsapp"></i>
                WhatsApp
              </a>

            </div>

            {/* STATISTIQUES */}
            <div className="hero-stats">

              <div className="hero-stat">
                <strong>500+</strong>
                <span>Apprenants</span>
              </div>

              <div className="hero-stat">
                <strong>15+</strong>
                <span>Formations</span>
              </div>

              <div className="hero-stat">
                <strong>95%</strong>
                <span>Satisfaction</span>
              </div>

            </div>

          </div>


          {/* VISUEL */}
          <div className="col-lg-6">

            <div className="hero-visual">

              <div className="hero-grid"></div>

              <div className="hero-image-wrapper">

                <img
                  src="/hero-building.jpg.jpeg"
                  alt="Projet de génie civil"
                  className="hero-image"
                />

              </div>

              <div className="hero-floating-card">

                <span className="hero-floating-icon">
                  <i className="bi bi-building"></i>
                </span>

                <div>
                  <strong>Génie civil</strong>
                  <small>Apprentissage pratique</small>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>

    </section>
  );
}

export default Hero;