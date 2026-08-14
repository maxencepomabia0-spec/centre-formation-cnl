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

    const formData = new FormData(event.currentTarget);

    const nom = formData.get("nom");
    const prenom = formData.get("prenom");
    const telephone = formData.get("telephone");
    const email = formData.get("email");
    const ville = formData.get("ville");
    const profil = formData.get("profil");
    const logiciel = formData.get("logiciel");
    const message = formData.get("message");

    const texte = `
Bonjour CNL,

Je souhaite m'inscrire à une formation.

Nom : ${nom}
Prénom : ${prenom}
Téléphone : ${telephone}
E-mail : ${email}
Ville : ${ville}
Profil : ${profil}
Logiciel souhaité : ${logiciel}
Formation : ${formation?.title || "À préciser"}

Message :
${message || "Aucun message supplémentaire."}
    `.trim();

    const whatsappUrl =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(texte)}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <main className="inscription-page">

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
              Remplissez vos informations et contactez directement
              notre équipe sur WhatsApp pour finaliser votre demande.
            </p>

          </div>

        </div>

      </section>


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

                    <label>Nom *</label>

                    <input
                      type="text"
                      name="nom"
                      placeholder="Votre nom"
                      required
                    />

                  </div>

                  <div className="col-md-6">

                    <label>Prénom *</label>

                    <input
                      type="text"
                      name="prenom"
                      placeholder="Votre prénom"
                      required
                    />

                  </div>

                  <div className="col-md-6">

                    <label>Téléphone *</label>

                    <input
                      type="tel"
                      name="telephone"
                      placeholder="+242 ..."
                      required
                    />

                  </div>

                  <div className="col-md-6">

                    <label>E-mail *</label>

                    <input
                      type="email"
                      name="email"
                      placeholder="vous@example.com"
                      required
                    />

                  </div>

                  <div className="col-md-6">

                    <label>Ville *</label>

                    <input
                      type="text"
                      name="ville"
                      placeholder="Brazzaville, Pointe-Noire..."
                      required
                    />

                  </div>

                  <div className="col-md-6">

                    <label>Profil *</label>

                    <select
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

                    <label>Formation sélectionnée</label>

                    <input
                      type="text"
                      value={formation?.title || ""}
                      readOnly
                    />

                  </div>

                  <div className="col-12">

                    <label>Logiciel souhaité *</label>

                    <select
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

                    <label>Message</label>

                    <textarea
                      name="message"
                      rows="5"
                      placeholder="Votre message..."
                    ></textarea>

                  </div>

                </div>


                <div className="inscription-warning">

                  <i className="bi bi-info-circle"></i>

                  <span>
                    Une seule formation / un seul logiciel est suivi
                    pendant la période de formation.
                  </span>

                </div>


                <button
                  type="submit"
                  className="inscription-submit"
                >

                  Envoyer ma demande

                  <i className="bi bi-whatsapp"></i>

                </button>

              </form>

            </div>


            <div className="col-lg-4">

              <aside className="inscription-side">

                <span>
                  VOTRE DEMANDE
                </span>

                <h2>
                  {formation?.title || "Formation CNL"}
                </h2>

                <p>
                  Votre demande sera préparée puis
                  transmise directement à l'équipe via WhatsApp.
                </p>

                <div className="side-line"></div>

                <div className="side-info">

                  <div>
                    <small>VILLE</small>
                    <strong>République du Congo</strong>
                  </div>

                  <div>
                    <small>CONTACT</small>
                    <strong>WhatsApp CNL</strong>
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

              </aside>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Inscription;