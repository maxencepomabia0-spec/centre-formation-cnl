import { useSearchParams, Link } from "react-router-dom";
import { useState } from "react";
import formations from "../data/formations";
import "./inscription.css";

/*
|--------------------------------------------------------------------------
| TARIFS OFFICIELS DES LOGICIELS
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| LOGICIELS TARIFÉS AUTORISÉS DANS LE FORMULAIRE
|--------------------------------------------------------------------------
*/

const logicielsTaries = [
  "Archicad",
  "AutoCAD",
  "IA + Génie Civil",
  "Initiation dessin à la main",
  "MS Project",
  "Piste",
  "Plaxis 2D",
  "Revit",
  "Robot",
  "Robot Structural",
  "SketchUp",
];


/*
|--------------------------------------------------------------------------
| TABLE DE CORRESPONDANCE : noms formations.js → clés tarifsLogiciels
|--------------------------------------------------------------------------
*/

const correspondanceLogiciels = {
  "Robot Structural Analysis": "Robot Structural",
  "Revit Architecture": "Revit",
  "Autodesk Revit": "Revit",
  "Microsoft Project": "MS Project",
};


/*
|--------------------------------------------------------------------------
| TARIFS OFFICIELS DES LOGICIELS
|--------------------------------------------------------------------------
*/

const tarifsLogiciels = {
  Archicad: {
    offre: "Standard",
    montant: 15000,
  },

  AutoCAD: {
    offre: "Standard",
    montant: 15000,
  },

  "IA + Génie Civil": {
    offre: "Premium",
    montant: 20000,
  },

  "Initiation dessin à la main": {
    offre: "Standard",
    montant: 12000,
  },

  "MS Project": {
    offre: "Premium",
    montant: 30000,
  },

  Piste: {
    offre: "Premium",
    montant: 30000,
  },

  "Plaxis 2D": {
    offre: "Premium",
    montant: 25000,
  },

  Revit: {
    offre: "Premium",
    montant: 25000,
  },

  Robot: {
    offre: "Premium",
    montant: 25000,
  },

  "Robot Structural": {
    offre: "Standard",
    montant: 15000,
  },

  SketchUp: {
    offre: "Standard",
    montant: 15000,
  },
};


/*
|--------------------------------------------------------------------------
| COMPOSANT INSCRIPTION
|--------------------------------------------------------------------------
*/

function Inscription() {
  /*
  |--------------------------------------------------------------------------
  | FORMATION D'ORIGINE
  |--------------------------------------------------------------------------
  */

  const [searchParams] = useSearchParams();

  const formationSlug = searchParams.get("formation");

  const formationOrigine = formations.find(
    (item) => item.slug === formationSlug
  );

  /*
  |--------------------------------------------------------------------------
  | FORMATION UTILISÉE PAR LE FORMULAIRE
  |--------------------------------------------------------------------------
  |
  | On garde la formation d'origine si elle existe.
  | Sinon on prend la première formation comme valeur de secours.
  |
  */

  const formation = formationOrigine ?? formations[0];


  /*
  |--------------------------------------------------------------------------
  | FILIÈRES DU FORMULAIRE
  |--------------------------------------------------------------------------
  */

  const filieresSouhaitees = [
    "Génie Civil",
    "Architecture",
    "TP professionnel",
  ];


  const filierePreselectionnee = filieresSouhaitees.includes(
    formationOrigine?.title
  )
    ? formationOrigine.title
    : filieresSouhaitees[0];


  /*
  |--------------------------------------------------------------------------
  | LOGICIEL SÉLECTIONNÉ
  |--------------------------------------------------------------------------
  */

  const [logicielSelectionne, setLogicielSelectionne] = useState("");


  /*
  |--------------------------------------------------------------------------
  | WHATSAPP
  |--------------------------------------------------------------------------
  */

  const whatsappNumber = "242064490583";


  /*
  |--------------------------------------------------------------------------
  | ENVOI DU FORMULAIRE
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    const formData = new FormData(form);

    /*
    |--------------------------------------------------------------------------
    | RÉCUPÉRATION DES DONNÉES
    |--------------------------------------------------------------------------
    */

    const nom = formData.get("nom")?.toString().trim();
    const prenom = formData.get("prenom")?.toString().trim();
    const telephone = formData.get("telephone")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const ville = formData.get("ville")?.toString().trim();
    const profil = formData.get("profil")?.toString().trim();
    const filiere = formData.get("filiere")?.toString().trim();
    const logiciel = formData.get("logiciel")?.toString().trim();
    const message = formData.get("message")?.toString().trim();


    /*
    |--------------------------------------------------------------------------
    | VÉRIFICATIONS
    |--------------------------------------------------------------------------
    */

    if (!nom || !prenom || !telephone || !email || !ville || !profil) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (!filiere) {
      alert("Veuillez choisir une filière.");
      return;
    }

    if (!logiciel) {
      alert("Veuillez choisir un logiciel.");
      return;
    }


    /*
    |--------------------------------------------------------------------------
    | RÉCUPÉRATION DU TARIF
    |--------------------------------------------------------------------------
    */

    const tarif = tarifsLogiciels[logiciel];

    if (!tarif) {
      alert(
        "Aucun tarif n'est disponible pour ce logiciel."
      );
      return;
    }


    try {

      /*
      |--------------------------------------------------------------------------
      | ENVOI AU BACKEND
      |--------------------------------------------------------------------------
      */
const accessToken = localStorage.getItem("access_token");

if (!accessToken) {
  alert("Vous devez être connecté pour vous inscrire.");
  return;
}
      const response = await fetch(
        "http://localhost:5001/api/inscriptions",
        {
          method: "POST",

          headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${accessToken}`,
},
          body: JSON.stringify({
            nom,
            prenom,
            telephone,
            email,
            ville,
            profil,
            filiere,
            logiciel,

            /*
            | L'offre vient du catalogue local.
            | Le backend vérifiera à nouveau le tarif dans Supabase.
            */

            offre: tarif.offre,

            message,

            /*
            |--------------------------------------------------------------------------
            | FORMATION D'ORIGINE
            |--------------------------------------------------------------------------
            */

            formation_slug:
              formation?.slug || null,

            formation_nom:
              formation?.title || null,
          }),
        }
      );


      /*
      |--------------------------------------------------------------------------
      | RÉPONSE DU BACKEND
      |--------------------------------------------------------------------------
      */

      const result = await response.json();


      /*
      |--------------------------------------------------------------------------
      | ERREUR
      |--------------------------------------------------------------------------
      */

      if (!response.ok || !result.success) {

        console.error(
          "Erreur inscription :",
          result
        );

        alert(
          result.message ||
          "Impossible d'enregistrer votre inscription."
        );

        return;
      }


      /*
      |--------------------------------------------------------------------------
      | INSCRIPTION CRÉÉE
      |--------------------------------------------------------------------------
      */

      const inscription = result.inscription;


      /*
      |--------------------------------------------------------------------------
      | MESSAGE WHATSAPP
      |--------------------------------------------------------------------------
      */

      const texte = `
Bonjour CNL,

Je souhaite m'inscrire à une formation.

Nom : ${nom}
Prénom : ${prenom}
Téléphone : ${telephone}
E-mail : ${email}
Ville : ${ville}
Profil : ${profil}

Filière souhaitée : ${filiere}
Logiciel souhaité : ${logiciel}
Formule : ${inscription.offre}
Montant : ${inscription.montant} FCFA

Formation d'origine :
${formationOrigine?.title || "Inscription générale"}

Message :
${message || "Aucun message supplémentaire."}
      `.trim();


      /*
      |--------------------------------------------------------------------------
      | URL WHATSAPP
      |--------------------------------------------------------------------------
      */

      const whatsappUrl =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          texte
        )}`;


      /*
      |--------------------------------------------------------------------------
      | OUVERTURE WHATSAPP
      |--------------------------------------------------------------------------
      */

      window.location.href = whatsappUrl;

    } catch (error) {

      console.error(
        "Erreur connexion backend :",
        error
      );

      alert(
        "Impossible de contacter le serveur. Vérifiez que le backend est bien démarré."
      );
    }
  };


  /*
  |--------------------------------------------------------------------------
  | AFFICHAGE
  |--------------------------------------------------------------------------
  */

  return (
    <main className="inscription-page">


      {/* =========================================================
          HERO
      ========================================================== */}

      <section className="inscription-hero">

        <div className="container">

          <div className="inscription-breadcrumb">

            <Link to="/">
              Accueil
            </Link>

            <i className="bi bi-chevron-right"></i>

            <span>
              Inscription
            </span>

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


      {/* =========================================================
          FORMULAIRE
      ========================================================== */}

      <section className="inscription-content">

        <div className="container">

          <div className="row g-5">


            {/* =====================================================
                COLONNE GAUCHE
            ====================================================== */}

            <div className="col-lg-8">

              <form
                className="inscription-form"
                onSubmit={handleSubmit}
              >


                {/* =================================================
                    INFORMATIONS PERSONNELLES
                ================================================== */}

                <div className="form-section-title">
                  Informations personnelles
                </div>


                <div className="row g-3">


                  {/* NOM */}

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


                  {/* PRÉNOM */}

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


                  {/* TÉLÉPHONE */}

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


                  {/* EMAIL */}

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


                  {/* VILLE */}

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


                  {/* PROFIL */}

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

                      <option value="Élève">
                        Élève
                      </option>

                      <option value="Travailleur">
                        Travailleur
                      </option>

                      <option value="Autre">
                        Autre
                      </option>

                    </select>

                  </div>

                </div>


                {/* =================================================
                    FORMATION
                ================================================== */}

                <div className="form-section-title">
                  Formation
                </div>


                <div className="row g-3">


                  {/* FILIÈRE */}

                  <div className="col-12">

                    <label htmlFor="filiere">
                      Filière souhaitée *
                    </label>

                    <select
                      id="filiere"
                      name="filiere"
                      defaultValue={filierePreselectionnee}
                      required
                    >

                      <option value="">
                        Choisir une filière
                      </option>

                      {filieresSouhaitees.map(
                        (filiere) => (
                          <option
                            key={filiere}
                            value={filiere}
                          >
                            {filiere}
                          </option>
                        )
                      )}

                    </select>

                  </div>


                  {/* LOGICIEL */}

                  <div className="col-12">

                    <label htmlFor="logiciel">
                      Logiciel souhaité *
                    </label>

                    <select
                      id="logiciel"
                      name="logiciel"
                      value={logicielSelectionne}
                      onChange={(event) => {
                        setLogicielSelectionne(
                          event.target.value
                        );
                      }}
                      required
                    >

                      <option value="">
                        Choisir un logiciel
                      </option>

                      {logicielsTaries.map(
                        (logiciel) => (
                          <option
                            key={logiciel}
                            value={logiciel}
                          >
                            {logiciel}
                          </option>
                        )
                      )}

                    </select>

                  </div>


                  {/* APERÇU TARIF */}

                  {logicielSelectionne &&
                    tarifsLogiciels[
                      logicielSelectionne
                    ] && (

                    <div className="col-12">

                      <div className="tarif-preview">

                        <div className="tarif-preview-item">

                          <small>
                            FORMULE
                          </small>

                          <strong>
                            {
                              tarifsLogiciels[
                                logicielSelectionne
                              ].offre
                            }
                          </strong>

                        </div>


                        <div className="tarif-preview-separator"></div>


                        <div className="tarif-preview-item">

                          <small>
                            TARIF
                          </small>

                          <strong>
                            {
                              tarifsLogiciels[
                                logicielSelectionne
                              ].montant.toLocaleString(
                                "fr-FR"
                              )
                            }{" "}
                            FCFA
                          </strong>

                        </div>

                      </div>

                    </div>
                  )}


                  {/* MESSAGE */}

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


                {/* =================================================
                    INFORMATION
                ================================================== */}

                <div className="inscription-warning">

                  <i className="bi bi-info-circle"></i>

                  <span>
                    Une seule formation et un seul logiciel sont
                    suivis pendant la période de formation.
                  </span>

                </div>


                {/* =================================================
                    BOUTON
                ================================================== */}

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


            {/* =====================================================
                COLONNE DROITE
            ====================================================== */}

            <div className="col-lg-4">

              <aside className="inscription-side">

                <div className="side-top-line"></div>

                <span className="side-label">
                  VOTRE DEMANDE
                </span>


                <h2>
                  {formationOrigine?.title ||
                    "Formation CNL"}
                </h2>


                <p>
                  Votre demande sera préparée automatiquement
                  puis transmise à l'équipe CNL via WhatsApp.
                </p>


                <div className="side-line"></div>


                <div className="side-info">


                  <div>
                    <small>
                      LOCALISATION
                    </small>

                    <strong>
                      République du Congo
                    </strong>
                  </div>


                  <div>
                    <small>
                      CONTACT
                    </small>

                    <strong>
                      WhatsApp CNL
                    </strong>
                  </div>


                  <div>
                    <small>
                      STATUT
                    </small>

                    <strong>
                      Demande manuelle
                    </strong>
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
