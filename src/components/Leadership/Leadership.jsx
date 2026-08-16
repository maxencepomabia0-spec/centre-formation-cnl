function Leadership() {
  return (
    <section className="leadership-section">

      <div className="leadership-line"></div>

      <div className="container">

        <div className="row align-items-center g-5">

          {/* =========================
              TEXTE
          ========================== */}

          <div className="col-lg-7">

            <div className="leadership-label">
              <span></span>
              Centre National de Leadership
            </div>

            <h2 className="leadership-title">
              Former aujourd'hui.
              <span>Construire demain.</span>
            </h2>

            <p className="leadership-description">
              Le Centre National de Leadership accompagne les
              apprenants dans le développement de compétences
              techniques et professionnelles adaptées aux
              exigences du monde du travail.solution adaptée aux besoins du marché et aux défis de demain.
            </p>

            <div className="leadership-points">

              <div>
                <i className="bi bi-check2"></i>
                <span>Formation orientée pratique</span>
              </div>

              <div>
                <i className="bi bi-check2"></i>
                <span>Compétences adaptées au terrain</span>
              </div>

              <div>
                <i className="bi bi-check2"></i>
                <span>Accompagnement professionnel</span>
              </div>

            </div>

          </div>


          {/* =========================
              BLOC VISUEL
          ========================== */}

          <div className="col-lg-5">

            <div className="leadership-visual">

              <div className="leadership-watermark">
                CNL
              </div>

              <div className="leadership-number">
                01
              </div>

              <div className="leadership-card">

                <img
                  src="/logo-cnl.png.jpeg"
                  alt="Centre National de Leadership"
                />

                <div>
                  <strong>
                    CNL
                  </strong>

                  <span>
                    Excellence • Compétence • Leadership
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Leadership;