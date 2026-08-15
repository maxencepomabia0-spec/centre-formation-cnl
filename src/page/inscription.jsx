import { useSearchParams, Link } from "react-router-dom";
import formations from "../data/formations";
import "./inscription.css";

function Inscription() {
  const [searchParams] = useSearchParams();

  const formationSlug = searchParams.get("formation");

  const formation = formations.find(
    (item) => item.slug === formationSlug
  );

  const whatsappNumber = "242064490583";

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const nom = formData.get("nom")?.toString().trim();
    const prenom = formData.get("prenom")?.toString().trim();
    const telephone = formData.get("telephone")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const ville = formData.get("ville")?.toString().trim();
    const profil = formData.get("profil")?.toString().trim();
    const logiciel = formData.get("logiciel")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    if (!formation) {
      alert("La formation sélectionnée est introuvable.");
      return;
    }

    const texte = `
Bonjour CNL,

Je souhaite m'inscrire à une formation.

Nom : ${nom}
Prénom : ${prenom}
Téléphone : ${telephone}
E-mail : ${email}
Ville : ${ville}
Profil : ${profil}

Formation : ${formation.title}
Logiciel souhaité : ${logiciel}

Message :
${message || "Aucun message supplémentaire."}
    `.trim();

    const whatsappUrl =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(texte)}`;

    window.location.href = whatsappUrl;
  };

  return (
    <main className="inscription-page">

      {/* =========================
          HERO
      ========================== */}

      <section className="inscription-hero">

        <div className="container">

          <div className="inscription-breadcrumb">
            <Link to="/">Accueil</Link>
            <i className="bi bi-chevron-right"></i>
            <span>Inscription</span>
          </div>

          <div className="inscription-heading">

            <span className="inscription-label">
              // DEMANDE D'ADHÉSION
            </span>

            <h1>
              Rejoignez
              <span> le CNL.</span>
            </h1>

            <p>
              Remplissez vos informations puis transmettez
              directement votre demande à notre équipe sur WhatsApp.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          FORMULAIRE
      ========================== */}

      <section className="inscription-content">

        <div className="container">

          <div className="row g-5">

            <div className="col-lg-8">

              <form
                className="inscription-form"
                onSubmit={handleSubmit}
              >

                <div className="form-section-title">
                  Informations personnelles
                </div>

                <div className="row g-3">

                  <div className="col-md-6">

                    <label htmlFor="nom">
                      Nom *
                    </label>

                    <input
                      id="nom"
                      type="text"
                      name="nom"
                      placeholder="Votre nom"
                      required
                    />

                  </div>


                  <div className="col-md-6">

                    <label htmlFor="prenom">
                      Prénom *
                    </label>

                    <input
                      id="prenom"
                      type="text"
                      name="prenom"
                      placeholder="Votre prénom"
                      required
                    />

                  </div>


                  <div className="col-md-6">

                    <label htmlFor="telephone">
                      Téléphone *
                    </label>

                    <input
                      id="telephone"
                      type="tel"
                      name="telephone"
                      placeholder="+242 ..."
                      required
                    />

                  </div>


                  <div className="col-md-6">

                    <label htmlFor="email">
                      E-mail *
                    </label>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="vous@example.com"
                      required
                    />

                  </div>


                  <div className="col-md-6">

                    <label htmlFor="ville">
                      Ville *
                    </label>

                    <input
                      id="ville"
                      type="text"
                      name="ville"
                      placeholder="Brazzaville, Pointe-Noire..."
                      required
                    />

                  </div>


                  <div className="col-md-6">

                    <label htmlFor="profil">
                      Profil *
                    </label>

                    <select
                      id="profil"
                      name="profil"
                      required
                    >
                      <option value="">
                        Choisir
                      </option>

                      <option value="Étudiant">
                        Étudiant
                      </option>

                      <option value="Professionnel">
                        Professionnel
                      </option>

                      <option value="Passionné / Autodidacte">
                        Passionné / Autodidacte
                      </option>
                    </select>

                  </div>

                </div>


                <div className="form-section-title">
                  Formation
                </div>

                <div className="row g-3">

                  <div className="col-12">

                    <label htmlFor="formation">
                      Formation sélectionnée
                    </label>

                    <input
                      id="formation"
                      type="text"
                      value={formation?.title || "Formation introuvable"}
                      readOnly
                    />

                  </div>


                  <div className="col-12">

                    <label htmlFor="logiciel">
                      Logiciel souhaité *
                    </label>

                    <select
                      id="logiciel"
                      name="logiciel"
                      required
                    >

                      <option value="">
                        Choisir un logiciel
                      </option>

                      {formation?.logiciels.map((logiciel) => (
                        <option
                          key={logiciel}
                          value={logiciel}
                        >
                          {logiciel}
                        </option>
                      ))}

                    </select>

                  </div>


                  <div className="col-12">

                    <label htmlFor="message">
                      Message
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      placeholder="Votre message..."
                    ></textarea>

                  </div>

                </div>


                <div className="inscription-warning">

                  <i className="bi bi-info-circle"></i>

                  <span>
                    Une seule formation et un seul logiciel sont
                    suivis pendant la période de formation.
                  </span>

                </div>


                <button
                  type="submit"
                  className="inscription-submit"
                >

                  <span>
                    Envoyer ma demande
                  </span>

                  <i className="bi bi-whatsapp"></i>

                </button>

              </form>

            </div>


            {/* =========================
                CÔTÉ DROIT
            ========================== */}

            <div className="col-lg-4">

              <aside className="inscription-side">

                <div className="side-top-line"></div>

                <span className="side-label">
                  VOTRE DEMANDE
                </span>

                <h2>
                  {formation?.title || "Formation CNL"}
                </h2>

                <p>
                  Votre demande sera préparée automatiquement
                  puis transmise à l'équipe CNL via WhatsApp.
                </p>

                <div className="side-line"></div>


                <div className="side-info">

                  <div>
                    <small>LOCALISATION</small>
                    <strong>République du Congo</strong>
                  </div>

                  <div>
                    <small>CONTACT</small>
                    <strong>WhatsApp CNL</strong>
                  </div>

                  <div>
                    <small>STATUT</small>
                    <strong>Demande manuelle</strong>
                  </div>

                </div>


                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="side-whatsapp"
                >

                  <i className="bi bi-whatsapp"></i>

                  Ouvrir WhatsApp

                </a>


                <div className="side-note">

                  <i className="bi bi-shield-check"></i>

                  <span>
                    Après vérification et validation par le centre,
                    le membre pourra accéder aux supports de cours.
                  </span>

                </div>

              </aside>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Inscription;