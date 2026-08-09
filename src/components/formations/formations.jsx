function Formations() {
  const formations = [
    {
      icon: "bi-building",
      category: "Génie civil",
      title: "Architecture & conception",
      description:
        "Apprenez les bases de la conception architecturale et développez vos compétences sur les outils professionnels.",
      level: "Débutant → Avancé",
      duration: "3 mois",
    },

    {
      icon: "bi-rulers",
      category: "Génie civil",
      title: "Bâtiment & construction",
      description:
        "Maîtrisez les principes essentiels de la construction, de la préparation du projet jusqu'au suivi des travaux.",
      level: "Débutant → Avancé",
      duration: "4 mois",
    },

    {
      icon: "bi-pc-display",
      category: "Logiciels",
      title: "AutoCAD & DAO",
      description:
        "Apprenez à réaliser des plans techniques professionnels et à travailler efficacement avec les outils de conception assistée.",
      level: "Débutant → Avancé",
      duration: "2 mois",
    },

    {
      icon: "bi-boxes",
      category: "BIM",
      title: "Revit & modélisation",
      description:
        "Découvrez la modélisation BIM et apprenez à concevoir des projets de construction en trois dimensions.",
      level: "Intermédiaire",
      duration: "3 mois",
    },

    {
      icon: "bi-map",
      category: "Topographie",
      title: "Topographie",
      description:
        "Développez les compétences nécessaires pour comprendre les relevés, mesures et travaux topographiques.",
      level: "Débutant → Avancé",
      duration: "3 mois",
    },

    {
      icon: "bi-calculator",
      category: "Technique",
      title: "Étude & dimensionnement",
      description:
        "Approfondissez les méthodes d'étude, de calcul et de dimensionnement appliquées aux projets de construction.",
      level: "Avancé",
      duration: "4 mois",
    },
  ];

  return (
    <section className="formations-section" id="formations">

      <div className="formations-background-number">
        06
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
            Des formations pratiques conçues pour vous permettre
            de développer des compétences directement applicables
            dans le monde professionnel.
          </p>

        </div>


        {/* =========================
            GRILLE
        ========================== */}

        <div className="row g-3">

          {formations.map((formation, index) => (

            <div
              className="col-lg-4 col-md-6"
              key={index}
            >

              <article className="formation-card">

                <div className="formation-card-top">

                  <div className="formation-icon">
                    <i className={`bi ${formation.icon}`}></i>
                  </div>

                  <span className="formation-number">
                    0{index + 1}
                  </span>

                </div>


                <div className="formation-card-content">

                  <span className="formation-category">
                    {formation.category}
                  </span>

                  <h3>
                    {formation.title}
                  </h3>

                  <p>
                    {formation.description}
                  </p>

                </div>


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


                <a
                  href="#inscription"
                  className="formation-link"
                >
                  Voir la formation

                  <span>
                    <i className="bi bi-arrow-up-right"></i>
                  </span>

                </a>

              </article>

            </div>

          ))}

        </div>


        {/* =========================
            CTA
        ========================== */}

        <div className="formations-cta">

          <div>
            <span>Une formation spécifique vous intéresse ?</span>

            <strong>
              Contactez directement notre équipe.
            </strong>
          </div>

          <a
            href="#contact"
            className="formations-cta-button"
          >
            Nous contacter
            <i className="bi bi-arrow-up-right"></i>
          </a>

        </div>

      </div>

    </section>
  );
}

export default Formations;