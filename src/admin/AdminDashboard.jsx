
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import {
  LayoutDashboard, Users, Wallet, BookOpen,
  Settings, LogOut, Menu, X, Search, RefreshCw,
  TrendingUp, Clock3, CircleCheck, GraduationCap,
  ChevronRight, ShieldCheck, Check, Ban, ArrowUpRight
} from "lucide-react";
import "./AdminDashboard.css";

const API = "http://localhost:5001";

const money = (n) =>
  `${new Intl.NumberFormat("fr-FR").format(Number(n) || 0)} FCFA`;

const sections = [
  { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
  { id: "students", label: "Étudiants", icon: Users },
  { id: "payments", label: "Paiements", icon: Wallet },
];

const statusLabel = (status) => {
  if (status === "paye") return "Payé";
  if (status === "refuse") return "Refusé";
  return "En attente";
};

function StatCard({ label, value, icon: Icon, tone, hint }) {
  return (
    <article className="cnl-stat-card">
      <div className="cnl-stat-top">
        <span>{label}</span>
        <div className={`cnl-stat-icon ${tone}`}>
          <Icon size={20} />
        </div>
      </div>
      <strong>{value}</strong>
      <small>{hint}</small>
    </article>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [section, setSection] = useState("overview");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [stats, setStats] = useState(null);
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("tous");
  const [selected, setSelected] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentProvider, setPaymentProvider] = useState("");

  const getToken = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session?.access_token) {
      throw new Error("Session expirée. Reconnectez-vous.");
    }
    return data.session.access_token;
  };

  const loadData = useCallback(async (initial = false) => {
    if (initial) setLoading(true);
    else setRefreshing(true);

    setError("");

    try {
      const token = await getToken();
      localStorage.setItem("access_token", token);

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [sr, ir] = await Promise.all([
        fetch(`${API}/api/admin/stats`, { headers }),
        fetch(`${API}/api/admin/inscriptions`, { headers }),
      ]);

      if (!sr.ok || !ir.ok) {
        if (sr.status === 401 || ir.status === 401)
          throw new Error("Session expirée.");
        if (sr.status === 403 || ir.status === 403)
          throw new Error("Accès administrateur refusé.");
        throw new Error("Impossible de récupérer les données CNL.");
      }

      const [sd, id] = await Promise.all([
        sr.json(),
        ir.json(),
      ]);

      setStats(sd.stats || null);
      setInscriptions(id.inscriptions || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData(true);
  }, [loadData]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return inscriptions.filter((item) => {
      const text = [
        item.nom, item.prenom, item.email,
        item.logiciel, item.formation_nom,
        item.filiere,
      ].join(" ").toLowerCase();

      const matchStatus =
        filter === "tous" || item.statut_paiement === filter;

      return text.includes(q) && matchStatus;
    });
  }, [inscriptions, search, filter]);

  const formations = useMemo(() => {
    const counts = {};

    inscriptions.forEach((item) => {
      const name = item.logiciel || "Non renseigné";
      counts[name] = (counts[name] || 0) + 1;
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [inscriptions]);

  const maxFormation = Math.max(
    1, ...formations.map(([, count]) => count)
  );

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      localStorage.removeItem("access_token");
      navigate("/login", { replace: true });
    } catch {
      setError("Impossible de terminer la déconnexion.");
    }
  };

  const updatePayment = async (status) => {
    if (!selected || processing) return;

    if (status === "paye" && !paymentRef.trim()) {
      setError("Saisissez la référence du paiement vérifié.");
      return;
    }

    const message = status === "paye"
      ? "Confirmer que ce paiement a réellement été reçu ?"
      : "Confirmer le refus de ce paiement ?";

    if (!window.confirm(message)) return;

    setProcessing(true);
    setError("");

    try {
      const token = await getToken();

      const response = await fetch(
        `${API}/api/admin/paiements/${selected.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            statut_paiement: status,
            provider_paiement: paymentProvider.trim() || null,
            reference_paiement: paymentRef.trim() || null,
          }),
        }
      );

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(
          result.message || "Mise à jour impossible."
        );
      }

      setSelected(null);
      setPaymentRef("");
      setPaymentProvider("");
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const openPayment = (item) => {
    setSelected(item);
    setPaymentRef(item.reference_paiement || "");
    setPaymentProvider(item.provider_paiement || "");
    setError("");
  };

  const navTo = (id) => {
    setSection(id);
    setMobileMenu(false);
    setSearch("");
    setFilter("tous");
  };

  const TableView = ({ rows, actions = false }) => (
    <div className="cnl-table-wrap">
      <table className="cnl-data-table">
        <thead>
          <tr>
            <th>Étudiant</th>
            <th>Formation</th>
            <th>Offre</th>
            <th>Montant</th>
            <th>Paiement</th>
            {actions && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="cnl-student-cell">
                  <div className="cnl-student-avatar">
                    {(item.prenom?.[0] || "E").toUpperCase()}
                  </div>
                  <div>
                    <strong>{item.prenom} {item.nom}</strong>
                    <small>{item.email}</small>
                  </div>
                </div>
              </td>
              <td>
                <strong>{item.logiciel || item.formation_nom || "—"}</strong>
                <small>{item.filiere || "—"}</small>
              </td>
              <td>{item.offre || "—"}</td>
              <td className="cnl-amount">{money(item.montant)}</td>
              <td>
                <span className={`cnl-status ${item.statut_paiement || "en_attente"}`}>
                  <span className="cnl-status-dot" />
                  {statusLabel(item.statut_paiement)}
                </span>
              </td>
              {actions && (
                <td>
                  <button
                    className="cnl-row-action"
                    onClick={() => openPayment(item)}
                  >
                    Gérer <ChevronRight size={15} />
                  </button>
                </td>
              )}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={actions ? 6 : 5} className="cnl-no-results">
                Aucun résultat disponible.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="cnl-premium-admin">
      {mobileMenu && (
        <button
          className="cnl-mobile-overlay"
          onClick={() => setMobileMenu(false)}
          aria-label="Fermer le menu"
        />
      )}

      <aside className={`cnl-sidebar ${mobileMenu ? "open" : ""}`}>
        <div className="cnl-sidebar-brand">
          <div className="cnl-brand-icon">
            <GraduationCap size={25} />
          </div>
          <div>
            <strong>CNL<span>.</span></strong>
            <small>ADMINISTRATION</small>
          </div>
          <button
            className="cnl-close-menu"
            onClick={() => setMobileMenu(false)}
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="cnl-sidebar-label">ESPACE DE TRAVAIL</div>

        <nav className="cnl-side-nav">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`cnl-side-link ${section === id ? "active" : ""}`}
              onClick={() => navTo(id)}
            >
              <Icon size={19} />
              <span>{label}</span>
              {section === id && <ChevronRight size={15} />}
            </button>
          ))}
        </nav>

        <div className="cnl-sidebar-label cnl-sidebar-second">
          PROCHAINEMENT
        </div>

        <div className="cnl-side-nav">
          <div className="cnl-side-link disabled">
            <BookOpen size={19} /> Formations & PDF
          </div>
          <div className="cnl-side-link disabled">
            <Settings size={19} /> Paramètres
          </div>
        </div>

        <div className="cnl-sidebar-bottom">
          <div className="cnl-admin-identity">
            <div className="cnl-identity-avatar">AD</div>
            <div>
              <strong>Administrateur</strong>
              <small>Accès sécurisé</small>
            </div>
            <ShieldCheck size={18} />
          </div>
          <button className="cnl-logout" onClick={logout}>
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </aside>

      <main className="cnl-main-area">
        <header className="cnl-topbar">
          <div className="cnl-topbar-left">
            <button
              className="cnl-menu-trigger"
              onClick={() => setMobileMenu(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu size={22} />
            </button>
            <span>Administration</span>
            <ChevronRight size={14} />
            <strong>
              {sections.find((s) => s.id === section)?.label}
            </strong>
          </div>
          <div className="cnl-topbar-right">
            <span className="cnl-live-pill">
              <span /> Espace sécurisé
            </span>
            <div className="cnl-top-avatar">AD</div>
          </div>
        </header>

        <div className="cnl-content">
          <div className="cnl-page-heading">
            <div>
              <span className="cnl-overline">CENTRE NATIONAL DE LEADERSHIP</span>
              <h1>
                {section === "overview" && "Vue d'ensemble"}
                {section === "students" && "Gestion des étudiants"}
                {section === "payments" && "Suivi des paiements"}
              </h1>
              <p>
                {section === "overview"
                  ? "Bienvenue dans votre espace de pilotage."
                  : "Consultez et gérez les données de votre centre."}
              </p>
            </div>
            <button
              className="cnl-refresh-btn"
              onClick={() => loadData()}
              disabled={refreshing}
            >
              <RefreshCw size={16} className={refreshing ? "cnl-spin" : ""} />
              Actualiser
            </button>
          </div>

          {error && (
            <div className="cnl-alert" role="alert">{error}</div>
          )}

          {loading ? (
            <div className="cnl-loading">Chargement des données CNL...</div>
          ) : (
            <>
              {section === "overview" && (
                <>
                  <section className="cnl-stats-grid">
                    <StatCard
                      label="Total inscriptions"
                      value={stats?.totalInscriptions ?? "—"}
                      icon={Users}
                      tone="blue"
                      hint="Inscriptions enregistrées"
                    />
                    <StatCard
                      label="Paiements en attente"
                      value={stats?.paiementsEnAttente ?? "—"}
                      icon={Clock3}
                      tone="amber"
                      hint="À vérifier"
                    />
                    <StatCard
                      label="Paiements validés"
                      value={stats?.paiementsValides ?? "—"}
                      icon={CircleCheck}
                      tone="green"
                      hint="Validations effectuées"
                    />
                    <StatCard
                      label="Revenus validés"
                      value={stats ? money(stats.revenusEncaisses) : "—"}
                      icon={TrendingUp}
                      tone="purple"
                      hint="Selon les paiements marqués payés"
                    />
                  </section>

                  <div className="cnl-overview-grid">
                    <section className="cnl-panel">
                      <div className="cnl-panel-heading">
                        <div>
                          <span className="cnl-panel-eyebrow">ANALYSE</span>
                          <h2>Formations populaires</h2>
                          <p>Répartition des inscriptions affichées</p>
                        </div>
                        <BookOpen size={20} />
                      </div>

                      <div className="cnl-bars">
                        {formations.length === 0 && (
                          <p>Aucune donnée disponible.</p>
                        )}
                        {formations.map(([name, count]) => (
                          <div className="cnl-bar-item" key={name}>
                            <div className="cnl-bar-meta">
                              <span>{name}</span>
                              <strong>{count}</strong>
                            </div>
                            <div className="cnl-bar-track">
                              <div
                                className="cnl-bar-fill"
                                style={{
                                  width: `${(count / maxFormation) * 100}%`
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="cnl-panel cnl-quick-panel">
                      <div className="cnl-panel-heading">
                        <div>
                          <span className="cnl-panel-eyebrow">ACCÈS RAPIDE</span>
                          <h2>Gestion quotidienne</h2>
                        </div>
                      </div>
                      <button onClick={() => navTo("students")}>
                        <Users size={20} />
                        <span>
                          <strong>Consulter les étudiants</strong>
                          <small>Liste des inscriptions</small>
                        </span>
                        <ArrowUpRight size={18} />
                      </button>
                      <button onClick={() => navTo("payments")}>
                        <Wallet size={20} />
                        <span>
                          <strong>Gérer les paiements</strong>
                          <small>Validation manuelle</small>
                        </span>
                        <ArrowUpRight size={18} />
                      </button>
                    </section>
                  </div>

                  <section className="cnl-panel">
                    <div className="cnl-panel-heading">
                      <div>
                        <span className="cnl-panel-eyebrow">ACTIVITÉ</span>
                        <h2>Inscriptions récentes</h2>
                      </div>
                      <button
                        className="cnl-text-button"
                        onClick={() => navTo("students")}
                      >
                        Voir tout <ArrowUpRight size={16} />
                      </button>
                    </div>
                    <TableView rows={inscriptions.slice(0, 6)} />
                  </section>
                </>
              )}

              {(section === "students" || section === "payments") && (
                <section className="cnl-panel">
                  <div className="cnl-panel-heading">
                    <div>
                      <span className="cnl-panel-eyebrow">GESTION</span>
                      <h2>
                        {section === "students"
                          ? "Liste des étudiants"
                          : "Vérification des paiements"}
                      </h2>
                      <p>{filtered.length} résultat(s) affiché(s)</p>
                    </div>
                  </div>

                  <div className="cnl-filters">
                    <div className="cnl-search-field">
                      <Search size={18} />
                      <input
                        placeholder="Rechercher un étudiant, une formation..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      aria-label="Filtrer par statut"
                    >
                      <option value="tous">Tous les statuts</option>
                      <option value="en_attente">En attente</option>
                      <option value="paye">Payés</option>
                      <option value="refuse">Refusés</option>
                    </select>
                  </div>

                  <TableView
                    rows={filtered}
                    actions={section === "payments"}
                  />
                  <p className="cnl-table-note">
                    Affichage limité aux 100 dernières inscriptions
                    renvoyées par l'API.
                  </p>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      {selected && (
        <div className="cnl-modal-backdrop">
          <div
            className="cnl-payment-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cnl-payment-title"
          >
            <div className="cnl-modal-header">
              <div>
                <span className="cnl-overline">ADMINISTRATION CNL</span>
                <h2 id="cnl-payment-title">Vérifier un paiement</h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Fermer"
                disabled={processing}
              >
                <X size={20} />
              </button>
            </div>

            <div className="cnl-payment-summary">
              <span>Étudiant</span>
              <strong>{selected.prenom} {selected.nom}</strong>
              <span>Formation</span>
              <strong>{selected.logiciel || "—"}</strong>
              <span>Montant attendu</span>
              <strong>{money(selected.montant)}</strong>
              <span>Statut actuel</span>
              <strong>{statusLabel(selected.statut_paiement)}</strong>
            </div>

            <label className="cnl-modal-label">
              Moyen de paiement
              <input
                value={paymentProvider}
                onChange={(e) => setPaymentProvider(e.target.value)}
                placeholder="Ex. MTN MoMo, Airtel Money, espèces"
              />
            </label>

            <label className="cnl-modal-label">
              Référence du paiement vérifié
              <input
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                placeholder="Référence de transaction ou reçu"
              />
            </label>

            <p className="cnl-modal-warning">
              Vérifiez réellement le paiement avant validation.
              Le statut ne constitue pas une preuve bancaire.
            </p>

            {error && <p className="cnl-alert">{error}</p>}

            <div className="cnl-modal-actions">
              <button
                className="cnl-refuse-btn"
                disabled={processing}
                onClick={() => updatePayment("refuse")}
              >
                <Ban size={17} /> Refuser
              </button>
              <button
                className="cnl-approve-btn"
                disabled={processing}
                onClick={() => updatePayment("paye")}
              >
                <Check size={17} />
                {processing ? "Traitement..." : "Valider le paiement"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
