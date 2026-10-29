
import { useEffect, useState } from "react";
import "./AdminDashboard.css";

const API_URL = "http://localhost:5001";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      const token = localStorage.getItem("access_token");

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [statsResponse, inscriptionsResponse] =
          await Promise.all([
            fetch(`${API_URL}/api/admin/stats`, { headers }),
            fetch(`${API_URL}/api/admin/inscriptions`, {
              headers,
            }),
          ]);

        if (!statsResponse.ok || !inscriptionsResponse.ok) {
          throw new Error(
            "Impossible de charger les données administrateur."
          );
        }

        const statsData = await statsResponse.json();
        const inscriptionsData =
          await inscriptionsResponse.json();

        if (!active) return;

        setStats(statsData.stats);
        setInscriptions(inscriptionsData.inscriptions || []);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const formatFCFA = (value) =>
    new Intl.NumberFormat("fr-FR").format(value || 0) +
    " FCFA";

  if (loading) {
    return <div className="cnl-admin-loading">Chargement...</div>;
  }

  return (
    <div className="cnl-admin">
      <aside className="cnl-admin-sidebar">
        <div className="cnl-admin-brand">
          <span className="cnl-admin-brand-mark">C</span>
          <div>
            <strong>CNL</strong>
            <small>Administration</small>
          </div>
        </div>

        <nav className="cnl-admin-nav">
          <a href="#overview" className="active">
            Vue d'ensemble
          </a>
          <a href="#students">Étudiants</a>
          <a href="#payments">Paiements</a>
        </nav>

        <div className="cnl-admin-sidebar-footer">
          Centre National de Leadership
        </div>
      </aside>

      <main className="cnl-admin-main" id="overview">
        <header className="cnl-admin-header">
          <div>
            <span className="cnl-admin-eyebrow">
              ESPACE ADMINISTRATEUR
            </span>
            <h1>Tableau de bord</h1>
            <p>
              Gestion des inscriptions et des paiements CNL.
            </p>
          </div>
          <div className="cnl-admin-avatar">AD</div>
        </header>

        {error && (
          <div className="cnl-admin-error">{error}</div>
        )}

        <section className="cnl-admin-stats">
          {[
            {
              label: "Inscriptions",
              value: stats?.totalInscriptions ?? "—",
            },
            {
              label: "Paiements en attente",
              value: stats?.paiementsEnAttente ?? "—",
            },
            {
              label: "Paiements validés",
              value: stats?.paiementsValides ?? "—",
            },
            {
              label: "Revenus encaissés",
              value: stats
                ? formatFCFA(stats.revenusEncaisses)
                : "—",
            },
          ].map((item) => (
            <article className="cnl-admin-stat" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </section>

        <section className="cnl-admin-panel" id="students">
          <div className="cnl-admin-panel-heading">
            <div>
              <h2>Inscriptions récentes</h2>
              <p>Les 100 dernières inscriptions disponibles.</p>
            </div>
            <span>{inscriptions.length} résultats</span>
          </div>

          <div className="cnl-admin-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Étudiant</th>
                  <th>Formation</th>
                  <th>Offre</th>
                  <th>Montant</th>
                  <th>Paiement</th>
                </tr>
              </thead>
              <tbody>
                {inscriptions.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>
                        {item.prenom} {item.nom}
                      </strong>
                      <small>{item.email}</small>
                    </td>
                    <td>
                      {item.formation_nom ||
                        item.logiciel ||
                        "Non renseignée"}
                    </td>
                    <td>{item.offre || "—"}</td>
                    <td>{formatFCFA(item.montant)}</td>
                    <td>
                      <span
                        className={`cnl-admin-status ${
                          item.statut_paiement === "paye"
                            ? "paid"
                            : "pending"
                        }`}
                      >
                        {item.statut_paiement === "paye"
                          ? "Payé"
                          : item.statut_paiement === "refuse"
                          ? "Refusé"
                          : "En attente"}
                      </span>
                    </td>
                  </tr>
                ))}

                {inscriptions.length === 0 && (
                  <tr>
                    <td colSpan="5" className="cnl-admin-empty">
                      Aucune inscription à afficher.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="cnl-admin-panel" id="payments">
          <h2>Gestion des paiements</h2>
          <p>
            La validation manuelle sera intégrée dans
            la prochaine étape.
          </p>
        </section>
      </main>
    </div>
  );
}
