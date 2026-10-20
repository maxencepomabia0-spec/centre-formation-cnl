
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  // ==========================================
  // 1. DÉCONNEXION
  // ==========================================

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    setError("");

    try {
      const { error: logoutError } = await supabase.auth.signOut({
        scope: "local",
      });

      if (logoutError) throw logoutError;

      localStorage.removeItem("access_token");

      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Erreur déconnexion :", err);
      setError("Impossible de vous déconnecter. Réessayez.");
      setLoggingOut(false);
    }
  };

  // ==========================================
  // 2. CHARGER LES DONNÉES ÉTUDIANT
  // ==========================================

  useEffect(() => {
    const controller = new AbortController();

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        // Session gérée par Supabase
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (controller.signal.aborted) return;

        if (sessionError || !session?.access_token) {
          navigate("/login", { replace: true });
          return;
        }

        // Token à jour pour l'API Express
        const token = session.access_token;

        // Appeler le backend CNL
        const response = await fetch(
          "http://localhost:5001/api/dashboard",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        if (response.status === 401) {
  await supabase.auth.signOut({ scope: "local" });

  localStorage.removeItem("access_token");

  navigate("/login", { replace: true });
  return;
}

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Impossible de charger votre espace."
          );
        }

        if (!controller.signal.aborted) {
          setData({
            user: result.user,
            inscriptions: Array.isArray(result.inscriptions)
              ? result.inscriptions
              : [],
          });
        }
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("Erreur dashboard :", err);

        if (!controller.signal.aborted) {
          setError(
            err.message || "Une erreur est survenue."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();

    return () => controller.abort();
  }, [navigate]);

  // ==========================================
  // 3. CHARGEMENT
  // ==========================================

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // 4. ERREUR
  // ==========================================

  if (error && !data) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">
          <h2>Oups 😕</h2>
          <p>{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  if (!data?.user) {
    return null;
  }

  const prenom = data.user.prenom || "Étudiant";
  const nom = data.user.nom || "";

  // ==========================================
  // 5. AFFICHAGE
  // ==========================================

  return (
    <div className="dashboard-page">

      {/* HEADER */}
      <section className="dashboard-header">
        <div>
          <p className="dashboard-welcome">
            ESPACE ÉTUDIANT
          </p>

          <h1>Bonjour {prenom} 👋</h1>

          <p>
            Bienvenue dans votre espace personnel de formation.
          </p>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="btn-logout"
          >
            {loggingOut ? "Déconnexion..." : "Se déconnecter"}
          </button>

          {error && (
            <p role="alert">{error}</p>
          )}
        </div>
      </section>

      {/* PROFIL */}
      <section className="dashboard-profile">
        <div className="profile-card">

          <div className="profile-icon">
            {prenom.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3>{prenom} {nom}</h3>
            <p>{data.user.email}</p>
          </div>

        </div>
      </section>

      {/* FORMATIONS */}
      <section className="dashboard-formations">

        <div className="section-title">
          <p>MON PARCOURS</p>
          <h2>Mes formations</h2>
        </div>

        {data.inscriptions.length === 0 ? (
          <div className="empty-dashboard">
            <h3>Aucune inscription</h3>
            <p>
              Vous n'avez encore aucune inscription à une formation.
            </p>
          </div>
        ) : (
          <div className="formations-grid">

            {data.inscriptions.map((inscription) => {
              const paiementValide =
                inscription.statut_paiement === "paye";

              const inscriptionValidee =
                inscription.statut === "valide";

              const accesAutorise =
                paiementValide && inscriptionValidee;

              return (
                <div
                  className="formation-card"
                  key={inscription.id}
                >

                  <div className="formation-card-top">
                    <span className="formation-badge">
                      {inscription.offre}
                    </span>

                    <span
                      className={`payment-status ${
                        inscription.statut_paiement
                      }`}
                    >
                      {paiementValide
                        ? "✓ Payé"
                        : "⏳ Paiement en attente"}
                    </span>
                  </div>

                  <h3>
                    {inscription.formation_nom || "Formation CNL"}
                  </h3>

                  <p className="software-name">
                    {inscription.logiciel}
                  </p>

                  <div className="formation-info">
                    <div>
                      <span>Filière</span>
                      <strong>
                        {inscription.filiere || "Non précisée"}
                      </strong>
                    </div>

                    <div>
                      <span>Montant</span>
                      <strong>
                        {Number(inscription.montant || 0)
                          .toLocaleString("fr-FR")} FCFA
                      </strong>
                    </div>

                    <div>
                      <span>Inscription</span>
                    <strong>
  {inscription.statut === "valide"
    ? "Validée"
    : inscription.statut === "refuse"
      ? "Refusée"
      : "En attente de validation"}
</strong>
                    </div>
                  </div>

                  {/* ACCÈS AUX COURS */}
                  {accesAutorise ? (
                    <div className="course-access-note">
                      <p>✓ Paiement et inscription validés.</p>
                      <p>
                        Vos supports seront accessibles ici
                        dès leur mise en ligne par le centre.
                      </p>
                    </div>
                  ) : (
                    <div className="course-locked-note">
                      <p>🔒 Accès aux cours verrouillé</p>

                      <p>
                        {!paiementValide
                          ? "Votre paiement est en attente de confirmation par le centre."
                          : "Votre paiement est confirmé. L'inscription doit encore être validée par le centre."}
                      </p>
                    </div>
                  )}

                </div>
              );
            })}

          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
