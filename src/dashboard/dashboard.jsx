import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          setError("Vous devez être connecté.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:5001/api/dashboard",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Impossible de charger le dashboard."
          );
        }

        setData(result);
      } catch (error) {
        console.error("Erreur dashboard :", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Chargement
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

  // Erreur
  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">
          <h2>Oups 😕</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* HEADER */}
      <section className="dashboard-header">
        <div>
          <p className="dashboard-welcome">
            ESPACE ÉTUDIANT
          </p>

          <h1>
            Bonjour {data.user.prenom} 👋
          </h1>

          <p>
            Bienvenue dans votre espace personnel de formation.
          </p>
        </div>
      </section>

      {/* INFORMATIONS UTILISATEUR */}
      <section className="dashboard-profile">
        <div className="profile-card">
          <div className="profile-icon">
            {data.user.prenom?.charAt(0)}
          </div>

          <div>
            <h3>
              {data.user.prenom} {data.user.nom}
            </h3>

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

            {data.inscriptions.map((inscription) => (
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
                    {inscription.statut_paiement === "paye"
                      ? "✓ Payé"
                      : "⏳ Paiement en attente"}
                  </span>
                </div>

                <h3>
                  {inscription.formation_nom}
                </h3>

                <p className="software-name">
                  {inscription.logiciel}
                </p>

                <div className="formation-info">

                  <div>
                    <span>Montant</span>
                    <strong>
                      {inscription.montant.toLocaleString("fr-FR")} FCFA
                    </strong>
                  </div>

                  <div>
                    <span>Inscription</span>
                    <strong>
                      {inscription.statut}
                    </strong>
                  </div>

                </div>

                {/* BOUTON */}
                {inscription.statut_paiement === "paye" ? (
                  <button className="btn-access">
                    Accéder à la formation →
                  </button>
                ) : (
                  <button className="btn-payment">
                    Procéder au paiement →
                  </button>
                )}

              </div>
            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default Dashboard;