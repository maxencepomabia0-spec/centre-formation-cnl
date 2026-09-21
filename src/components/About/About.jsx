import { useEffect, useState } from "react";
import "../../styles/about.css";

const galleryImages = [
  "/hero-building.jpg.jpeg",
  "/WhatsApp Image 2026-08-18 at 23.14.02.jpeg",
  "/WhatsApp Image 2026-08-18 at 23.14.03.jpeg",
  "/WhatsApp Image 2026-08-18 at 23.14.37.jpeg",
];

const softwareList = [
  "AutoCAD",
  "Archicad",
  "Revit",
  "SketchUp",
  "Blender",
  "Robot Structural Analysis",
  "ETABS",
  "SAP2000",
  "PLAXIS",
  "Pack Microsoft Office",
  "Microsoft Project",
  "Navisworks",
  "AutoPiste",
  "Covadis",
  "GRAITEC",
];

function About() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % galleryImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="about-section" id="about-cnl">
      <div className="container">
        <div className="about-visual-wrap">
          <div className="about-visual-label">
            <span></span>
            CNL
          </div>

          <div className="about-slider" aria-label="Galerie du CNL">
            {galleryImages.map((image, index) => (
              <img
                key={image}
                src={image}
                alt="Membres du CNL"
                className={index === activeIndex ? "about-slide active" : "about-slide"}
              />
            ))}
          </div>

          <div className="about-slider-dots" aria-label="Indicateurs du slideshow">
            {galleryImages.map((image, index) => (
              <button
                key={image}
                type="button"
                className={index === activeIndex ? "dot active" : "dot"}
                onClick={() => setActiveIndex(index)}
                aria-label={`Afficher la photo ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="about-content">
          <div className="section-label about-label">
            <span></span>
            À propos du CNL
          </div>

          <h2 className="about-title">À propos du CNL</h2>

          <div className="about-body">
            <p>
              Le Club National de Logiciels (CNL) est une plateforme d’apprentissage,
              de pratique et de partage dédiée à la maîtrise des logiciels
              professionnels, particulièrement dans les domaines de l’architecture,
              du génie civil, du BTP et des métiers de la construction.
            </p>

            <p>
              Notre ambition est de préparer une nouvelle génération de professionnels
              aux exigences du monde numérique, en leur permettant d’acquérir des
              compétences pratiques, utiles et directement applicables sur le terrain.
            </p>

            <p>
              Au CNL, nous pensons que la maîtrise des outils numériques permet de
              gagner du temps, améliorer la précision du travail, réduire les erreurs
              et optimiser la réalisation des projets.
            </p>
          </div>

          <div className="about-block">
            <h3>Pour qui ?</h3>

            <p>
              Le CNL est ouvert à tous ceux qui souhaitent apprendre, pratiquer ou
              perfectionner leurs compétences :
            </p>

            <ul className="about-list">
              <li>Étudiants en architecture, génie civil, BTP et domaines connexes ;</li>
              <li>Architectes, ingénieurs et techniciens ;</li>
              <li>Dessinateurs et professionnels de la construction ;</li>
              <li>Entrepreneurs et responsables de projets ;</li>
              <li>Artisans et ouvriers du BTP, notamment les soudeurs, plombiers, menuisiers, maçons, etc. ;</li>
              <li>Toute personne souhaitant apprendre ou mieux maîtriser les logiciels professionnels.</li>
            </ul>

            <p>
              Notre objectif est également de permettre aux différents corps de métier
              de mieux comprendre, lire et décrypter les plans techniques liés à leur
              activité, et progressivement d’être capables de réaliser ou d’adapter
              des plans selon leurs besoins.
            </p>
          </div>

          <div className="about-block">
            <h3>Notre approche</h3>

            <p>
              Nous privilégions une formation pratique et accessible, basée sur
              l’apprentissage, la mise en pratique et la progression. Nos membres
              peuvent développer leurs compétences sur des logiciels tels que
              Archicad, AutoCAD, Robo et d’autres outils utilisés dans le monde
              professionnel.
            </p>

            <p>
              Que vous soyez débutant, étudiant, professionnel expérimenté ou
              simplement désireux d’améliorer vos compétences, le CNL vous accompagne
              dans votre progression.
            </p>
          </div>

          <div className="about-block">
            <h3>Notre vision</h3>

            <p>
              Faire de la maîtrise numérique un véritable levier de compétence, de
              productivité et d’évolution professionnelle.
            </p>

            <p>
              Nous voulons construire une communauté où chacun peut apprendre,
              pratiquer, partager et progresser, afin de mieux répondre aux besoins
              actuels et futurs du monde professionnel.
            </p>
          </div>

          <div className="about-block software-block">
            <h3>Logiciels maîtrisés</h3>

            <div className="software-grid">
              {softwareList.map((software) => (
                <span key={software} className="software-tag">
                  {software}
                </span>
              ))}
            </div>
          </div>

          <div className="about-signature">
            CNL — La maîtrise numérique au service de la construction.
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
