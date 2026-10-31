import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import { motion } from "motion/react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import {
  LayoutDashboard,
  Users,
  Wallet,
  GraduationCap,
  LogOut,
  Menu,
  Search,
  RefreshCw,
  Clock3,
  CircleCheck,
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  ShieldCheck,
  BookOpen,
  Settings,
  X,
  Check,
  Ban,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import "./AdminDashboard.css";

const API = "http://localhost:5001";
const money = (n) =>
  `${new Intl.NumberFormat("fr-FR").format(Number(n) || 0)} FCFA`;
const navigation = [
  { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
  { id: "students", label: "Étudiants", icon: Users },
  { id: "payments", label: "Paiements", icon: Wallet },
];
const labels = { paye: "Payé", refuse: "Refusé", en_attente: "En attente" };
const status = (value) => labels[value] || "En attente";
const dateLabel = (value) =>
  value
    ? new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(value))
    : "—";

function StatusBadge({ value }) {
  const variant =
    value === "paye" ? "paid" : value === "refuse" ? "rejected" : "pending";
  return (
    <span className={`cnl-v2-status ${variant}`}>
      <span className="cnl-v2-dot" />
      {status(value)}
    </span>
  );
}

function Metric({ title, value, subtitle, icon: Icon, accent, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      <Card className="cnl-v2-metric">
        <CardContent className="cnl-v2-metric-inner">
          <div className="cnl-v2-metric-top">
            <span>{title}</span>
            <span className={`cnl-v2-metric-icon ${accent}`}>
              <Icon size={19} />
            </span>
          </div>
          <strong>{value}</strong>
          <small>{subtitle}</small>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StudentTable({ rows, showActions, onManage }) {
  return (
    <div className="cnl-v2-table-scroll">
      <table className="cnl-v2-table">
        <thead>
          <tr>
            <th>ÉTUDIANT</th>
            <th>FORMATION</th>
            <th>INSCRIPTION</th>
            <th>MONTANT</th>
            <th>PAIEMENT</th>
            {showActions && <th>ACTION</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="cnl-v2-person">
                  <span className="cnl-v2-person-avatar">
                    {(item.prenom?.[0] || item.nom?.[0] || "E").toUpperCase()}
                  </span>
                  <span>
                    <b>
                      {item.prenom} {item.nom}
                    </b>
                    <small>{item.email || item.telephone || "—"}</small>
                  </span>
                </div>
              </td>
              <td>
                <b>{item.logiciel || item.formation_nom || "—"}</b>
                <small className="cnl-v2-cell-sub">
                  {item.filiere || item.offre || "—"}
                </small>
              </td>
              <td>{dateLabel(item.created_at)}</td>
              <td>
                <b>{money(item.montant)}</b>
              </td>
              <td>
                <StatusBadge value={item.statut_paiement} />
              </td>
              {showActions && (
                <td>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onManage(item)}
                  >
                    Gérer <ChevronRight size={14} />
                  </Button>
                </td>
              )}
            </tr>
          ))}
          {!rows.length && (
            <tr>
              <td colSpan={showActions ? 6 : 5} className="cnl-v2-empty">
                Aucune inscription ne correspond à votre recherche.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [section, setSection] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);
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
    const { data, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !data.session?.access_token)
      throw new Error("Session expirée. Reconnectez-vous.");
    return data.session.access_token;
  };

  const loadData = useCallback(async (initial = false) => {
    if (initial) setLoading(true);
    else setRefreshing(true);
    setError("");
    try {
      const token = await getToken();
      localStorage.setItem("access_token", token);
      const headers = { Authorization: `Bearer ${token}` };
      const [sr, ir] = await Promise.all([
        fetch(`${API}/api/admin/stats`, { headers }),
        fetch(`${API}/api/admin/inscriptions`, { headers }),
      ]);
      if (!sr.ok || !ir.ok) {
        if ([sr.status, ir.status].includes(401))
          throw new Error("Session expirée. Reconnectez-vous.");
        if ([sr.status, ir.status].includes(403))
          throw new Error("Accès administrateur refusé.");
        throw new Error("Impossible de récupérer les données CNL.");
      }
      const [sd, id] = await Promise.all([sr.json(), ir.json()]);
      setStats(sd.stats || null);
      setInscriptions(Array.isArray(id.inscriptions) ? id.inscriptions : []);
    } catch (e) {
      setError(e.message || "Erreur de chargement.");
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
    return inscriptions.filter((i) => {
      const text = [
        i.nom,
        i.prenom,
        i.email,
        i.telephone,
        i.logiciel,
        i.formation_nom,
        i.filiere,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return (
        text.includes(q) &&
        (filter === "tous" || (i.statut_paiement || "en_attente") === filter)
      );
    });
  }, [inscriptions, search, filter]);

  const formationData = useMemo(() => {
    const counts = new Map();
    inscriptions.forEach((i) => {
      const name = i.logiciel || i.formation_nom || "Non renseigné";
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));
  }, [inscriptions]);

  const goTo = (id) => {
    setSection(id);
    setMenuOpen(false);
    setSearch("");
    setFilter("tous");
  };
  const openPayment = (item) => {
    setSelected(item);
    setPaymentRef(item.reference_paiement || "");
    setPaymentProvider(item.provider_paiement || "");
    setError("");
  };
  const logout = async () => {
    try {
      const { error: e } = await supabase.auth.signOut();
      if (e) throw e;
      localStorage.removeItem("access_token");
      navigate("/login", { replace: true });
    } catch {
      setError("Impossible de terminer la déconnexion.");
    }
  };

  const updatePayment = async (nextStatus) => {
    if (!selected || processing) return;
    if (nextStatus === "paye" && !paymentRef.trim()) {
      setError("Saisissez la référence du paiement vérifié.");
      return;
    }
    if (
      !window.confirm(
        nextStatus === "paye"
          ? "Confirmer que ce paiement a réellement été reçu ?"
          : "Confirmer le refus de ce paiement ?",
      )
    )
      return;
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
            statut_paiement: nextStatus,
            provider_paiement: paymentProvider.trim() || null,
            reference_paiement: paymentRef.trim() || null,
          }),
        },
      );
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Mise à jour impossible.");
      }
      setSelected(null);
      setPaymentRef("");
      setPaymentProvider("");
      await loadData();
    } catch (e) {
      setError(e.message || "Erreur lors de la mise à jour.");
    } finally {
      setProcessing(false);
    }
  };

  const title =
    section === "overview"
      ? "Vue d'ensemble"
      : section === "students"
        ? "Gestion des étudiants"
        : "Suivi des paiements";
  return (
    <div className="cnl-v2">
      {menuOpen && (
        <button
          className="cnl-v2-overlay"
          aria-label="Fermer le menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <aside className={`cnl-v2-sidebar ${menuOpen ? "is-open" : ""}`}>
        <div className="cnl-v2-brand">
          <span className="cnl-v2-brand-symbol">
            <GraduationCap size={24} />
          </span>
          <span>
            <b>
              CNL<span className="cnl-v2-brand-period">.</span>
            </b>
            <small>ADMINISTRATION</small>
          </span>
          <button
            className="cnl-v2-mobile-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>
        <div className="cnl-v2-nav-label">ESPACE DE TRAVAIL</div>
        <nav className="cnl-v2-nav">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`cnl-v2-nav-item ${section === id ? "active" : ""}`}
              onClick={() => goTo(id)}
            >
              <Icon size={19} />
              <span>{label}</span>
              {section === id && <ChevronRight size={15} />}
            </button>
          ))}
        </nav>
        <div className="cnl-v2-nav-label cnl-v2-nav-label-secondary">
          PROCHAINEMENT
        </div>
        <div className="cnl-v2-nav">
          <div className="cnl-v2-nav-item disabled">
            <BookOpen size={19} /> Formations & PDF
          </div>
          <div className="cnl-v2-nav-item disabled">
            <Settings size={19} /> Paramètres
          </div>
        </div>
        <div className="cnl-v2-sidebar-bottom">
          <div className="cnl-v2-admin">
            <span className="cnl-v2-admin-avatar">AD</span>
            <span>
              <b>Administrateur</b>
              <small>Accès sécurisé</small>
            </span>
            <ShieldCheck size={18} />
          </div>
          <button className="cnl-v2-logout" onClick={logout}>
            <LogOut size={17} /> Déconnexion
          </button>
        </div>
      </aside>
      <div className="cnl-v2-main">
        <header className="cnl-v2-topbar">
          <div className="cnl-v2-breadcrumb">
            <button
              className="cnl-v2-hamburger"
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu size={22} />
            </button>
            <span>Administration</span>
            <ChevronRight size={15} />
            <b>{title}</b>
          </div>
          <div className="cnl-v2-topright">
            <span className="cnl-v2-secure">
              <span /> Espace sécurisé
            </span>
            <span className="cnl-v2-top-avatar">AD</span>
          </div>
        </header>
        <main className="cnl-v2-content">
          <div className="cnl-v2-heading">
            <div>
              <div className="cnl-v2-kicker">
                CENTRE NATIONAL DE LEADERSHIP <span> / </span> ESPACE ADMIN
              </div>
              <h1>
                {title}
                <span className="cnl-v2-heading-period">.</span>
              </h1>
              <p>
                {section === "overview"
                  ? "Une vision claire de l'activité de votre centre de formation."
                  : section === "students"
                    ? "Retrouvez et consultez les inscriptions enregistrées."
                    : "Contrôlez et validez les règlements après vérification réelle."}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => loadData()}
              disabled={refreshing}
            >
              <RefreshCw
                size={16}
                className={refreshing ? "cnl-v2-spin" : ""}
              />{" "}
              Actualiser
            </Button>
          </div>
          {error && (
            <div className="cnl-v2-alert" role="alert">
              {error}
            </div>
          )}
          {loading ? (
            <div className="cnl-v2-loading">
              <div className="cnl-v2-metrics">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-36 rounded-2xl" />
                ))}
              </div>
              <Skeleton className="h-80 rounded-2xl" />
            </div>
          ) : (
            <>
              {section === "overview" && (
                <>
                  <div className="cnl-v2-metrics">
                    <Metric
                      index={0}
                      title="Total inscriptions"
                      value={stats?.totalInscriptions ?? "—"}
                      subtitle="Inscriptions enregistrées"
                      icon={Users}
                      accent="indigo"
                    />
                    <Metric
                      index={1}
                      title="Paiements en attente"
                      value={stats?.paiementsEnAttente ?? "—"}
                      subtitle="À vérifier manuellement"
                      icon={Clock3}
                      accent="amber"
                    />
                    <Metric
                      index={2}
                      title="Paiements validés"
                      value={stats?.paiementsValides ?? "—"}
                      subtitle="Transactions confirmées"
                      icon={CircleCheck}
                      accent="green"
                    />
                    <Metric
                      index={3}
                      title="Revenus validés"
                      value={stats ? money(stats.revenusEncaisses) : "—"}
                      subtitle="Selon les statuts validés"
                      icon={TrendingUp}
                      accent="slate"
                    />
                  </div>
                  <div className="cnl-v2-overview-grid">
                    <section className="cnl-v2-panel cnl-v2-chart-panel">
                      <div className="cnl-v2-panel-heading">
                        <div>
                          <span className="cnl-v2-eyebrow">
                            ANALYSE DES INSCRIPTIONS
                          </span>
                          <h2>Formations populaires</h2>
                          <p>Top 6 sur les inscriptions récupérées</p>
                        </div>
                        <span className="cnl-v2-panel-icon">
                          <BookOpen size={19} />
                        </span>
                      </div>
                      {formationData.length ? (
                        <div className="cnl-v2-chart">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={formationData}
                              layout="vertical"
                              margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
                            >
                              <CartesianGrid
                                stroke="#edf0f3"
                                horizontal={false}
                              />
                              <XAxis
                                type="number"
                                allowDecimals={false}
                                tick={{ fontSize: 11, fill: "#9299a5" }}
                                axisLine={false}
                                tickLine={false}
                              />
                              <YAxis
                                dataKey="name"
                                type="category"
                                width={105}
                                tick={{ fontSize: 11, fill: "#5b6677" }}
                                axisLine={false}
                                tickLine={false}
                              />
                              <Tooltip
                                formatter={(value) => [
                                  `${value} inscription(s)`,
                                  "Total",
                                ]}
                                cursor={{ fill: "#f4f6f9" }}
                              />
                              <Bar
                                dataKey="count"
                                radius={[0, 7, 7, 0]}
                                barSize={18}
                              >
                                {formationData.map((entry, i) => (
                                  <Cell
                                    key={entry.name}
                                    fill={
                                      i === 0
                                        ? "#283b60"
                                        : i === 1
                                          ? "#667da6"
                                          : "#b5c1d2"
                                    }
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <p className="cnl-v2-empty">
                          Aucune donnée disponible pour le graphique.
                        </p>
                      )}
                    </section>
                    <section className="cnl-v2-panel cnl-v2-shortcuts">
                      <div className="cnl-v2-panel-heading">
                        <div>
                          <span className="cnl-v2-eyebrow">RACCOURCIS</span>
                          <h2>Gestion quotidienne</h2>
                          <p>Accédez rapidement aux opérations</p>
                        </div>
                      </div>
                      <button onClick={() => goTo("students")}>
                        <span className="cnl-v2-shortcut-icon">
                          <Users size={20} />
                        </span>
                        <span>
                          <b>Consulter les étudiants</b>
                          <small>Voir les dernières inscriptions</small>
                        </span>
                        <ArrowUpRight size={18} />
                      </button>
                      <button onClick={() => goTo("payments")}>
                        <span className="cnl-v2-shortcut-icon">
                          <Wallet size={20} />
                        </span>
                        <span>
                          <b>Vérifier les paiements</b>
                          <small>Validation manuelle sécurisée</small>
                        </span>
                        <ArrowUpRight size={18} />
                      </button>
                      <div className="cnl-v2-info">
                        <ShieldCheck size={18} />
                        <span>
                          Les paiements sont validés uniquement après
                          vérification par un administrateur.
                        </span>
                      </div>
                    </section>
                  </div>
                  <section className="cnl-v2-panel cnl-v2-table-panel">
                    <div className="cnl-v2-panel-heading">
                      <div>
                        <span className="cnl-v2-eyebrow">ACTIVITÉ RÉCENTE</span>
                        <h2>Dernières inscriptions</h2>
                        <p>
                          Les six inscriptions les plus récentes renvoyées par
                          l'API
                        </p>
                      </div>
                      <Button variant="ghost" onClick={() => goTo("students")}>
                        Voir tout <ArrowUpRight size={16} />
                      </Button>
                    </div>
                    <StudentTable
                      rows={inscriptions.slice(0, 6)}
                      showActions={false}
                    />
                  </section>
                </>
              )}
              {(section === "students" || section === "payments") && (
                <section className="cnl-v2-panel cnl-v2-table-panel">
                  <div className="cnl-v2-panel-heading">
                    <div>
                      <span className="cnl-v2-eyebrow">
                        {section === "students"
                          ? "ANNUAIRE"
                          : "CONTRÔLE FINANCIER"}
                      </span>
                      <h2>
                        {section === "students"
                          ? "Liste des étudiants"
                          : "Vérification des paiements"}
                      </h2>
                      <p>{filtered.length} résultat(s) affiché(s)</p>
                    </div>
                    <Badge variant="outline">
                      {inscriptions.length} dossiers chargés
                    </Badge>
                  </div>
                  <div className="cnl-v2-filters">
                    <label className="cnl-v2-search">
                      <Search size={17} />
                      <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher un nom, email, formation..."
                        aria-label="Rechercher"
                      />
                    </label>
                    <select
                      aria-label="Filtrer par statut"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value="tous">Tous les statuts</option>
                      <option value="en_attente">En attente</option>
                      <option value="paye">Payés</option>
                      <option value="refuse">Refusés</option>
                    </select>
                  </div>
                  <StudentTable
                    rows={filtered}
                    showActions={section === "payments"}
                    onManage={openPayment}
                  />
                  <p className="cnl-v2-footnote">
                    Liste limitée aux 100 dernières inscriptions renvoyées par
                    l'API.
                  </p>
                </section>
              )}
            </>
          )}
        </main>
      </div>
      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open && !processing) {
            setSelected(null);
            setError("");
          }
        }}
      >
        <DialogContent
          className="cnl-v2-dialog sm:max-w-[510px]"
          onInteractOutside={(event) => {
            if (processing) event.preventDefault();
          }}
          onEscapeKeyDown={(event) => {
            if (processing) event.preventDefault();
          }}
        >
          <DialogHeader>
            <div className="cnl-v2-eyebrow">ADMINISTRATION CNL</div>
            <DialogTitle>Vérifier un paiement</DialogTitle>
            <DialogDescription>
              Vérifiez la réception effective des fonds avant toute validation.
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <>
              <div className="cnl-v2-payment-details">
                <span>Étudiant</span>
                <b>
                  {selected.prenom} {selected.nom}
                </b>
                <span>Formation</span>
                <b>{selected.logiciel || selected.formation_nom || "—"}</b>
                <span>Montant attendu</span>
                <b>{money(selected.montant)}</b>
                <span>Statut actuel</span>
                <b>{status(selected.statut_paiement)}</b>
              </div>
              <label className="cnl-v2-field">
                Moyen de paiement
                <Input
                  disabled={processing}
                  value={paymentProvider}
                  onChange={(e) => setPaymentProvider(e.target.value)}
                  placeholder="MTN MoMo, Airtel Money, espèces..."
                />
              </label>
              <label className="cnl-v2-field">
                Référence du paiement vérifié
                <Input
                  disabled={processing}
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  placeholder="Référence de transaction ou reçu"
                />
              </label>
              <p className="cnl-v2-warning">
                Un statut « Payé » ne constitue pas une preuve bancaire.
              </p>
              {error && (
                <p className="cnl-v2-alert" role="alert">
                  {error}
                </p>
              )}
              <DialogFooter className="cnl-v2-dialog-actions">
                <Button
                  variant="outline"
                  disabled={processing}
                  onClick={() => updatePayment("refuse")}
                >
                  <Ban size={16} /> Refuser
                </Button>
                <Button
                  disabled={processing}
                  onClick={() => updatePayment("paye")}
                >
                  <Check size={16} />
                  {processing ? "Traitement..." : "Valider le paiement"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
