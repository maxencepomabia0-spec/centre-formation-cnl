import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useState } from "react";
import formations from "../data/formations";
import { supabase } from "../config/supabase";
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

const whatsappNumber = "242064490583";

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
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
  | ENVOI DU FORMULAIRE
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
 
    const formData = new FormData(e.currentTarget);
    const nom = formData.get("nom")?.toString().trim();
    const prenom = formData.get("prenom")?.toString().trim();
    const telephone = formData.get("telephone")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const ville = formData.get("ville")?.toString().trim();
    const profil = formData.get("profil")?.toString().trim();
    const filiere = formData.get("filiere")?.toString().trim();
    const logiciel = formData.get("logiciel")?.toString().trim();
    const message = formData.get("message")?.toString().trim();
    const tarif = tarifsLogiciels[logiciel];

    if (!nom || !prenom || !telephone || !email || !ville || !profil) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (!tarif) {
      setError("Impossible de déterminer le tarif de cette inscription.");
      return;
    }

    setLoading(true);

  try {
    // ==========================================
    // 1. VÉRIFIER S'IL EXISTE DÉJÀ UNE SESSION
    // ==========================================

    let {
      data: { session },
    } = await supabase.auth.getSession();

    // ==========================================
    // 2. SI PAS DE SESSION → CRÉER LE COMPTE
    // ==========================================

    if (!session) {
      const registerResponse = await fetch(
        "http://localhost:5001/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            nom,
            prenom,
          }),
        }
      );

      const registerResult = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(
          registerResult.message || "Impossible de créer votre compte."
        );
      }

      // ==========================================
      // 3. CONNEXION AUTOMATIQUE
      // ==========================================

      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) {
        throw new Error(
          "Votre compte a été créé, mais la connexion automatique a échoué. Connectez-vous depuis la page de connexion."
        );
      }

      session = loginData.session;
    }

    // ==========================================
    // 4. VÉRIFIER LA SESSION
    // ==========================================

    const accessToken = session?.access_token;

    if (!accessToken) {
      throw new Error(
        "Impossible de récupérer votre session. Veuillez vous reconnecter."
      );
    }
    localStorage.setItem("access_token", accessToken);
    navigate("/dashboard");

    // ==========================================
    // 5. ENREGISTRER L'INSCRIPTION
    // ==========================================

    const inscriptionResponse = await fetch(
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
          offre: tarif.offre,
          message,
          formation_slug: formation?.slug || null,
          formation_nom: formation?.title || null,
        }),
      }
    );

    const inscriptionResult = await inscriptionResponse.json();

    if (!inscriptionResponse.ok) {
      throw new Error(
        inscriptionResult.message ||
          "Impossible d'enregistrer votre inscription."
      );
    }

    // ==========================================
    // 6. RÉCUPÉRER LE VRAI MONTANT DU BACKEND
    // ==========================================

    const inscription = inscriptionResult.inscription;

    const montantFinal =
      inscription?.montant ?? tarif.montant;

localStorage.setItem("access_token", accessToken);

navigate("/dashboard");
    // ==========================================
    // 9. ALLER AU DASHBOARD
    // ==========================================

     navigate("/dashboard");

  } catch (error) {
    console.error("Erreur inscription :", error);

    setError(
      error.message || "Une erreur est survenue pendant l'inscription."
    );
  } finally {
    setLoading(false);
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
                  <div className="form-group">
  <label htmlFor="password">Mot de passe *</label>

  <input
    id="password"
    name="password"
    type="password"
    placeholder="Choisissez un mot de passe"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    minLength={6}
    required
  />

  <small>
    Ce mot de passe vous permettra d'accéder à votre espace étudiant.
  </small>
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
         disabled={loading}
>
       <span>
    {loading ? "Création de votre espace..." : "Créer mon espace étudiant"}
       </span>

      <i className="bi bi-arrow-right"></i>
     </button>

                {error && (
                  <p className="inscription-error" role="alert">
                    {error}
                  </p>
                )}

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
