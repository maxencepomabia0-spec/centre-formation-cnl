import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import { motion, AnimatePresence } from "motion/react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  LayoutDashboard,
  Users,
  Wallet,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  RefreshCw,
  TrendingUp,
  Clock3,
  CircleCheck,
  GraduationCap,
  ChevronRight,
  ShieldCheck,
  Check,
  Ban,
  ArrowUpRight,
  Sun,
  Moon,
  Bell,
  Download,
  CalendarDays,
  Building2,
  ArrowRight,
  MoreHorizontal,
  ChevronLeft,
  ChevronDown,
  ChartNoAxesCombined,
  ClipboardList,
  LockKeyhole,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  Eye,
  Layers3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import "./AdminDashboard.css";

// Conservez la même route backend que votre dashboard précédent.
const API = import.meta.env.VITE_API_URL || "http://localhost:5001";
const money = (amount) =>
  `${new Intl.NumberFormat("fr-FR").format(Number(amount) || 0)} FCFA`;
const number = (value) =>
  new Intl.NumberFormat("fr-FR").format(Number(value) || 0);
const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};
const formatTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
};
const STATUS = {
  paye: { label: "Payé", className: "paid" },
  refuse: { label: "Refusé", className: "rejected" },
  en_attente: { label: "En attente", className: "pending" },
};
const statusMeta = (status) => STATUS[status] || STATUS.en_attente;
const navigation = [
  { id: "overview", label: "Vue d'ensemble", Icon: LayoutDashboard },
  { id: "students", label: "Étudiants", Icon: Users },
  { id: "payments", label: "Paiements", Icon: Wallet },
];
const futureNavigation = [
  { label: "Formations & PDF", Icon: BookOpen },
  { label: "Rapports", Icon: ChartNoAxesCombined },
  { label: "Paramètres", Icon: Settings },
];
const PALETTE = [
  "#3976f6",
  "#7667f5",
  "#24bea3",
  "#f4af48",
  "#8c9bb6",
  "#e16d9b",
];

function getChartData(items, months = 6) {
  const now = new Date();
  const result = Array.from({ length: months }, (_, index) => {
    const d = new Date(
      now.getFullYear(),
      now.getMonth() - (months - index - 1),
      1,
    );
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      name: d.toLocaleDateString("fr-FR", { month: "short" }),
      inscriptions: 0,
    };
  });
  const byKey = new Map(result.map((entry) => [entry.key, entry]));
  items.forEach((item) => {
    if (!item.created_at) return;
    const d = new Date(item.created_at);
    if (Number.isNaN(d.getTime())) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (byKey.has(key)) byKey.get(key).inscriptions++;
  });
  return result;
}

function StatusPill({ status }) {
  const meta = statusMeta(status);
  return (
    <span className={`executive-status ${meta.className}`}>
      <span />
      {meta.label}
    </span>
  );
}

function Sidebar({
  section,
  onNavigate,
  onLogout,
  mobileOpen,
  closeMobile,
  email,
}) {
  return (
    <>
      {mobileOpen && (
        <button
          className="executive-mobile-shade"
          aria-label="Fermer le menu"
          onClick={closeMobile}
        />
      )}
      <aside className={`executive-sidebar ${mobileOpen ? "is-open" : ""}`}>
        <div className="executive-brand">
          <div className="executive-brand-mark">
            <Building2 size={24} strokeWidth={1.8} />
          </div>
          <div>
            <strong>
              CNL<span>.</span>
            </strong>
            <small>CENTRE NATIONAL DE LEADERSHIP</small>
          </div>
          <button
            className="executive-mobile-close"
            onClick={closeMobile}
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>
        <div className="executive-sidebar-label">ESPACE DE TRAVAIL</div>
        <nav className="executive-nav" aria-label="Navigation administrateur">
          {navigation.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`executive-nav-link ${section === id ? "active" : ""}`}
              onClick={() => onNavigate(id)}
            >
              <Icon size={18} />
              <span>{label}</span>
              {section === id && <ChevronRight size={15} />}
            </button>
          ))}
        </nav>
        <div className="executive-sidebar-label executive-sidebar-label-second">
          PROCHAINEMENT
        </div>
        <div className="executive-nav">
          {futureNavigation.map(({ label, Icon }) => (
            <div
              className="executive-nav-link disabled"
              key={label}
              aria-disabled="true"
              title="Fonctionnalité à venir"
            >
              <Icon size={18} />
              <span>{label}</span>
              <LockKeyhole size={12} />
            </div>
          ))}
        </div>
        <div className="executive-sidebar-spacer" />
        <div className="executive-sidebar-feature">
          <div className="executive-feature-art">
            <Building2 size={44} strokeWidth={1} />
          </div>
          <span>CNL · GÉNIE CIVIL</span>
          <strong>Former aujourd'hui les bâtisseurs de demain.</strong>
        </div>
        <div className="executive-sidebar-account">
          <div className="executive-account-avatar">AD</div>
          <div>
            <strong>Administrateur</strong>
            <small title={email || "Compte sécurisé"}>
              {email || "Accès sécurisé"}
            </small>
          </div>
          <ShieldCheck size={17} />
        </div>
        <button className="executive-logout" onClick={onLogout}>
          <LogOut size={18} /> Déconnexion
        </button>
      </aside>
    </>
  );
}

function StatCard({ title, value, hint, Icon, color, delay = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 13 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, delay }}
      className="executive-stat"
    >
      <div className="executive-stat-head">
        <div className={`executive-stat-icon ${color}`}>
          <Icon size={21} />
        </div>
        <span className="executive-stat-decor">
          <ArrowUpRight size={15} />
        </span>
      </div>
      <div className="executive-stat-title">{title}</div>
      <strong className="executive-stat-value">{value}</strong>
      <div className="executive-stat-bottom">
        <span className={`executive-stat-point ${color}`} />
        {hint}
      </div>
    </motion.article>
  );
}

function SectionHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="executive-section-heading">
      <div>
        <span className="executive-eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {actions}
    </div>
  );
}

function EnrollmentChart({ items, total }) {
  const [period, setPeriod] = useState(6);
  const data = useMemo(() => getChartData(items, period), [items, period]);
  return (
    <div className="executive-panel executive-enrollment">
      <SectionHeader
        eyebrow="ANALYSE"
        title="Évolution des inscriptions"
        description="Inscriptions par mois selon les dates enregistrées"
        actions={
          <select
            className="executive-period"
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            aria-label="Période du graphique"
          >
            <option value={6}>6 mois</option>
            <option value={12}>12 mois</option>
          </select>
        }
      />
      <div className="executive-chart-total">
        <strong>{number(total)}</strong>
        <span>inscription(s) au total selon l'API</span>
      </div>
      <div
        className="executive-chart-area"
        role="img"
        aria-label="Graphique mensuel des inscriptions"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 12, right: 8, left: -22, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="executiveBlueFade"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#487ef4" stopOpacity={0.24} />
                <stop offset="100%" stopColor="#487ef4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="var(--ex-chart-grid)"
              strokeDasharray="3 6"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--ex-muted)", fontSize: 11 }}
              dy={12}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--ex-muted)", fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                background: "var(--ex-panel)",
                border: "1px solid var(--ex-border)",
                borderRadius: 12,
                color: "var(--ex-text)",
              }}
              formatter={(value) => [value, "Inscriptions"]}
            />
            <Area
              dataKey="inscriptions"
              type="monotone"
              stroke="#477df5"
              strokeWidth={2.8}
              fill="url(#executiveBlueFade)"
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="executive-quiet-note">
        Historique calculé sur les inscriptions chargées (100 maximum
        actuellement).
      </p>
    </div>
  );
}

function PopularChart({ items }) {
  const { segments, total } = useMemo(() => {
    const counts = new Map();
    items.forEach((item) => {
      const key = item.logiciel || item.formation_nom || "Non renseigné";
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const top = sorted.slice(0, 5).map(([name, value]) => ({ name, value }));
    const rest = sorted.slice(5).reduce((sum, [, value]) => sum + value, 0);
    if (rest > 0) top.push({ name: "Autres", value: rest });
    return { segments: top, total: items.length };
  }, [items]);
  return (
    <div className="executive-panel executive-popular">
      <SectionHeader
        eyebrow="FORMATIONS"
        title="Formations populaires"
        description="Répartition des inscriptions récupérées"
      />
      {total ? (
        <div className="executive-donut-layout">
          <div className="executive-donut-chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segments}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="67%"
                  outerRadius="88%"
                  paddingAngle={3}
                  stroke="none"
                >
                  {segments.map((s, i) => (
                    <Cell key={s.name} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v} inscription(s)`, "Nombre"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="executive-donut-center">
              <strong>{number(total)}</strong>
              <span>inscriptions</span>
            </div>
          </div>
          <div className="executive-legend">
            {segments.map((s, i) => (
              <div className="executive-legend-row" key={s.name}>
                <span
                  className="executive-legend-dot"
                  style={{ background: PALETTE[i % PALETTE.length] }}
                />
                <span title={s.name}>{s.name}</span>
                <strong>{Math.round((s.value / total) * 100)} %</strong>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="executive-empty-chart">
          Aucune inscription à analyser.
        </div>
      )}
    </div>
  );
}

function StudentsTable({
  rows,
  onPayment,
  enableActions = false,
  showControls = false,
  totalCount,
  onExport,
}) {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const maxPage = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, maxPage);
  const visible = rows.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  return (
    <>
      {showControls && (
        <div className="executive-table-controls">
          <span>{rows.length} résultat(s) dans les données chargées</span>
          <div>
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download size={14} /> Exporter CSV
            </Button>
            <label>
              Par page{" "}
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </label>
          </div>
        </div>
      )}
      <div className="executive-table-scroll">
        <table className="executive-table">
          <thead>
            <tr>
              <th>ÉTUDIANT</th>
              <th>FORMATION / LOGICIEL</th>
              <th>FILIÈRE</th>
              <th>MONTANT</th>
              <th>PAIEMENT</th>
              <th>INSCRIPTION</th>
              {enableActions && <th>ACTION</th>}
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="executive-student">
                    <span className="executive-student-avatar">
                      {(item.prenom?.[0] || "E").toUpperCase()}
                      {(item.nom?.[0] || "").toUpperCase()}
                    </span>
                    <div>
                      <strong>
                        {item.prenom || ""} {item.nom || ""}
                      </strong>
                      <small title={item.email}>{item.email || "—"}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <strong>{item.logiciel || item.formation_nom || "—"}</strong>
                  <small>{item.offre || ""}</small>
                </td>
                <td>{item.filiere || "—"}</td>
                <td className="executive-money">{money(item.montant)}</td>
                <td>
                  <StatusPill status={item.statut_paiement} />
                </td>
                <td>
                  {formatDate(item.created_at)}
                  <small>{formatTime(item.created_at)}</small>
                </td>
                {enableActions && (
                  <td>
                    <button
                      className="executive-row-button"
                      onClick={() => onPayment(item)}
                      title="Examiner le paiement"
                    >
                      <Eye size={16} /> Gérer
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {!visible.length && (
              <tr>
                <td colSpan={enableActions ? 7 : 6} className="executive-empty">
                  Aucune inscription correspondant à vos critères.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="executive-table-footer">
        <span>
          {rows.length
            ? `${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, rows.length)} sur ${rows.length}`
            : "0 résultat"}
          {typeof totalCount === "number" && totalCount > rows.length
            ? ` · ${number(totalCount)} au total (API limitée)`
            : ""}
        </span>
        <div className="executive-pages">
          <button
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
            aria-label="Page précédente"
          >
            <ChevronLeft size={16} />
          </button>
          <span>
            Page {currentPage} / {maxPage}
          </span>
          <button
            disabled={currentPage >= maxPage}
            onClick={() => setPage(currentPage + 1)}
            aria-label="Page suivante"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
}

function ActivityPanel({ items, navigate }) {
  return (
    <div className="executive-panel executive-activity">
      <SectionHeader
        eyebrow="ACTIVITÉ"
        title="Dernières inscriptions"
        actions={
          <button
            className="executive-inline-link"
            onClick={() => navigate("students")}
          >
            Tout voir <ArrowUpRight size={15} />
          </button>
        }
      />
      {items.length ? (
        <div className="executive-activity-list">
          {items.slice(0, 4).map((item) => (
            <div key={item.id} className="executive-activity-item">
              <div className="executive-activity-icon">
                <ClipboardList size={17} />
              </div>
              <div>
                <strong>
                  {item.prenom} {item.nom}
                </strong>
                <small>
                  {item.logiciel ||
                    item.formation_nom ||
                    "Nouvelle inscription"}
                </small>
              </div>
              <time>{formatDate(item.created_at)}</time>
            </div>
          ))}
        </div>
      ) : (
        <div className="executive-empty-chart">
          Aucune activité enregistrée.
        </div>
      )}
    </div>
  );
}

function csvEscape(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}
function exportCSV(items) {
  const columns = [
    "nom",
    "prenom",
    "email",
    "telephone",
    "ville",
    "filiere",
    "logiciel",
    "offre",
    "montant",
    "statut_paiement",
    "created_at",
  ];
  const content =
    "\uFEFF" +
    [
      columns.join(";"),
      ...items.map((item) =>
        columns.map((key) => csvEscape(item[key])).join(";"),
      ),
    ].join("\r\n");
  const url = URL.createObjectURL(
    new Blob([content], { type: "text/csv;charset=utf-8;" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "cnl-inscriptions-export.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("cnl-admin-theme") === "dark"
        ? "dark"
        : "light";
    } catch {
      return "light";
    }
  });
  const [section, setSection] = useState("overview");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [stats, setStats] = useState(null);
  const [inscriptions, setInscriptions] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("tous");
  const [selected, setSelected] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentProvider, setPaymentProvider] = useState("");
  useEffect(() => {
    try {
      localStorage.setItem("cnl-admin-theme", theme);
    } catch {
      /* stockage inaccessible */
    }
  }, [theme]);

  const getToken = async () => {
    const { data, error: authError } = await supabase.auth.getSession();
    if (authError || !data.session?.access_token)
      throw new Error("Session expirée. Reconnectez-vous.");
    setEmail(data.session.user?.email || "");
    return data.session.access_token;
  };

  const loadData = useCallback(async (initial = false) => {
    if (initial) setLoading(true);
    else setRefreshing(true);
    setError("");
    try {
      const { data, error: authError } = await supabase.auth.getSession();
      if (authError || !data.session?.access_token)
        throw new Error("Session expirée. Reconnectez-vous.");
      setEmail(data.session.user?.email || "");
      const token = data.session.access_token;
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
        throw new Error(
          "Impossible de récupérer les données administrateur CNL.",
        );
      }
      const [sd, id] = await Promise.all([sr.json(), ir.json()]);
      setStats(sd.stats || null);
      setInscriptions(Array.isArray(id.inscriptions) ? id.inscriptions : []);
    } catch (err) {
      setError(err.message || "Erreur de chargement.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);
  useEffect(() => {
    loadData(true);
  }, [loadData]);

  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase("fr");
    return inscriptions.filter((item) => {
      const fields = [
        item.nom,
        item.prenom,
        item.email,
        item.logiciel,
        item.formation_nom,
        item.filiere,
        item.telephone,
      ]
        .join(" ")
        .toLocaleLowerCase("fr");
      return (
        fields.includes(q) &&
        (filter === "tous" || (item.statut_paiement || "en_attente") === filter)
      );
    });
  }, [inscriptions, search, filter]);
  const sorted = useMemo(
    () =>
      [...inscriptions].sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0),
      ),
    [inscriptions],
  );
  const navigateSection = (id) => {
    setSection(id);
    setMobileMenu(false);
    setSearch("");
    setFilter("tous");
  };
  const logout = async () => {
    try {
      const { error: authError } = await supabase.auth.signOut();
      if (authError) throw authError;
      localStorage.removeItem("access_token");
      navigate("/login", { replace: true });
    } catch {
      setError("Impossible de terminer la déconnexion.");
    }
  };
  const openPayment = (item) => {
    setSelected(item);
    setPaymentRef(item.reference_paiement || "");
    setPaymentProvider(item.provider_paiement || "");
    setError("");
  };
  const updatePayment = async (status) => {
    if (!selected || processing) return;
    if (status === "paye" && !paymentRef.trim()) {
      setError("Indiquez la référence du paiement réellement vérifié.");
      return;
    }
    if (
      !window.confirm(
        status === "paye"
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
            statut_paiement: status,
            provider_paiement: paymentProvider.trim() || null,
            reference_paiement: paymentRef.trim() || null,
          }),
        },
      );
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || "Mise à jour impossible.");
      }
      setSelected(null);
      setPaymentRef("");
      setPaymentProvider("");
      await loadData();
    } catch (err) {
      setError(err.message || "Erreur de paiement.");
    } finally {
      setProcessing(false);
    }
  };
  const currentTitle =
    section === "overview"
      ? "Vue d'ensemble"
      : section === "students"
        ? "Gestion des étudiants"
        : "Gestion des paiements";
  const displayedRows = section === "overview" ? sorted.slice(0, 8) : filtered;

  return (
    <div className="executive-admin" data-theme={theme}>
      <Sidebar
        section={section}
        onNavigate={navigateSection}
        onLogout={logout}
        mobileOpen={mobileMenu}
        closeMobile={() => setMobileMenu(false)}
        email={email}
      />
      <main className="executive-main">
        <header className="executive-topbar">
          <button
            className="executive-menu-btn"
            onClick={() => setMobileMenu(true)}
            aria-label="Ouvrir la navigation"
          >
            <Menu size={21} />
          </button>
          <div className="executive-top-search">
            <Search size={18} />
            <input
              aria-label="Rechercher une inscription"
              placeholder="Rechercher un étudiant, une formation, un logiciel..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (e.target.value.trim()) setSection("students");
              }}
            />
          </div>
          <div className="executive-top-actions">
            <span className="executive-security">
              <ShieldCheck size={15} /> Espace sécurisé
            </span>
            <button
              className="executive-theme-toggle"
              aria-label={
                theme === "dark"
                  ? "Activer le mode clair"
                  : "Activer le mode sombre"
              }
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <div className="executive-top-avatar">AD</div>
          </div>
        </header>
        <div className="executive-content">
          <div className="executive-breadcrumb">
            ADMINISTRATION <ChevronRight size={13} />{" "}
            <strong>{currentTitle.toUpperCase()}</strong>
          </div>
          {error && (
            <div className="executive-error" role="alert">
              <AlertCircle size={18} /> <span>{error}</span>
              <button onClick={() => setError("")} aria-label="Fermer l'alerte">
                <X size={15} />
              </button>
            </div>
          )}
          {section === "overview" ? (
            <>
              <section className="executive-hero">
                <div className="executive-hero-inner">
                  <div>
                    <span>CENTRE NATIONAL DE LEADERSHIP / ESPACE ADMIN</span>
                    <h1>
                      Bonjour, bienvenue{" "}
                      <span className="executive-wave">✳</span>
                    </h1>
                    <p>
                      Une vision claire de l'activité de votre centre de
                      formation.
                    </p>
                  </div>
                  <div className="executive-hero-meta">
                    <span>
                      <CalendarDays size={14} />
                      {new Date().toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="executive-hero-chip">
                      <ShieldCheck size={14} /> Administration sécurisée
                    </span>
                  </div>
                </div>
                <div className="executive-hero-building" aria-hidden="true">
                  <Building2 size={170} strokeWidth={0.6} />
                </div>
              </section>
              <div className="executive-heading-row">
                <div>
                  <span className="executive-eyebrow">
                    VOTRE CENTRE EN UN COUP D'ŒIL
                  </span>
                  <h2>Tableau de bord</h2>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadData()}
                  disabled={refreshing}
                >
                  <RefreshCw
                    size={15}
                    className={refreshing ? "executive-spinning" : ""}
                  />{" "}
                  Actualiser
                </Button>
              </div>
              {loading ? (
                <div className="executive-loader">
                  Chargement des données du centre...
                </div>
              ) : (
                <>
                  <section
                    className="executive-stats-grid"
                    aria-label="Statistiques administrateur"
                  >
                    <StatCard
                      title="Total inscriptions"
                      value={stats ? number(stats.totalInscriptions) : "—"}
                      hint="Inscriptions enregistrées"
                      Icon={Users}
                      color="blue"
                      delay={0}
                    />
                    <StatCard
                      title="Paiements en attente"
                      value={stats ? number(stats.paiementsEnAttente) : "—"}
                      hint="À contrôler manuellement"
                      Icon={Clock3}
                      color="amber"
                      delay={0.06}
                    />
                    <StatCard
                      title="Paiements validés"
                      value={stats ? number(stats.paiementsValides) : "—"}
                      hint="Statuts marqués payés"
                      Icon={CircleCheck}
                      color="green"
                      delay={0.12}
                    />
                    <StatCard
                      title="Revenus validés"
                      value={stats ? money(stats.revenusEncaisses) : "—"}
                      hint="Selon les statuts de paiement"
                      Icon={TrendingUp}
                      color="purple"
                      delay={0.18}
                    />
                  </section>
                  <div className="executive-dashboard-grid">
                    <EnrollmentChart
                      items={inscriptions}
                      total={stats?.totalInscriptions ?? inscriptions.length}
                    />
                    <PopularChart items={inscriptions} />
                    <div className="executive-promo">
                      <span>CNL · GÉNIE CIVIL</span>
                      <h3>Une formation d'excellence.</h3>
                      <p>Construire des compétences pour bâtir l'avenir.</p>
                      <div className="executive-promo-building">
                        <Building2 size={112} strokeWidth={0.7} />
                      </div>
                    </div>
                    <div className="executive-panel executive-recent">
                      <SectionHeader
                        eyebrow="ADMINISTRATION"
                        title="Dernières inscriptions"
                        description="Les dernières inscriptions récupérées"
                        actions={
                          <button
                            className="executive-inline-link"
                            onClick={() => navigateSection("students")}
                          >
                            Voir tout <ArrowUpRight size={15} />
                          </button>
                        }
                      />
                      <StudentsTable
                        key="recent"
                        rows={displayedRows}
                        totalCount={stats?.totalInscriptions}
                        enableActions
                        onPayment={openPayment}
                      />
                    </div>
                    <div className="executive-right-stack">
                      <div className="executive-panel executive-shortcuts">
                        <SectionHeader
                          eyebrow="ACCÈS RAPIDE"
                          title="Gestion quotidienne"
                        />
                        <div className="executive-shortcut-grid">
                          <button onClick={() => navigateSection("students")}>
                            <span>
                              <Users size={19} />
                            </span>
                            Gérer les étudiants <ArrowRight size={15} />
                          </button>
                          <button onClick={() => navigateSection("payments")}>
                            <span>
                              <Wallet size={19} />
                            </span>
                            Voir les paiements <ArrowRight size={15} />
                          </button>
                          <button onClick={() => exportCSV(inscriptions)}>
                            <span>
                              <Download size={19} />
                            </span>
                            Exporter les inscriptions <ArrowRight size={15} />
                          </button>
                        </div>
                      </div>
                      <ActivityPanel
                        items={sorted}
                        navigate={navigateSection}
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="executive-heading-row executive-page-title">
                <div>
                  <span className="executive-eyebrow">
                    CENTRE NATIONAL DE LEADERSHIP
                  </span>
                  <h1>{currentTitle}</h1>
                  <p>
                    {section === "students"
                      ? "Retrouvez les étudiants, leurs formations et leurs coordonnées."
                      : "Vérifiez les paiements avant de confirmer leur réception."}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadData()}
                  disabled={refreshing}
                >
                  <RefreshCw
                    size={15}
                    className={refreshing ? "executive-spinning" : ""}
                  />{" "}
                  Actualiser
                </Button>
              </div>
              <section className="executive-panel executive-management">
                <div className="executive-manage-header">
                  <div>
                    <h2>
                      {section === "students"
                        ? "Répertoire des étudiants"
                        : "Suivi des transactions"}
                    </h2>
                    <p>
                      {filtered.length} inscription(s) dans les résultats
                      chargés
                    </p>
                  </div>
                  <div className="executive-manage-filters">
                    <label className="executive-filter-search">
                      <Search size={16} />
                      <input
                        aria-label="Rechercher dans les inscriptions"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Nom, email, formation..."
                      />
                    </label>
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      aria-label="Filtrer les paiements"
                    >
                      <option value="tous">Tous les statuts</option>
                      <option value="en_attente">En attente</option>
                      <option value="paye">Payés</option>
                      <option value="refuse">Refusés</option>
                    </select>
                  </div>
                </div>
                {loading ? (
                  <div className="executive-loader">Chargement...</div>
                ) : (
                  <StudentsTable
                    key={`${section}-${filter}-${search}`}
                    rows={filtered}
                    totalCount={stats?.totalInscriptions}
                    enableActions={section === "payments"}
                    onPayment={openPayment}
                    showControls
                    onExport={() => exportCSV(filtered)}
                  />
                )}
                <p className="executive-quiet-note">
                  Important : la liste et la pagination portent sur les 100
                  dernières inscriptions fournies par l'API actuelle.
                </p>
              </section>
            </>
          )}
          <footer className="executive-footer">
            <span>
              © {new Date().getFullYear()} CNL · Centre National de Leadership
            </span>
            <span>
              <span className="executive-footer-dot" /> Interface
              d'administration · v3
            </span>
          </footer>
        </div>
      </main>
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
          className={`executive-payment-dialog ${theme === "dark" ? "theme-dark" : ""}`}
        >
          <DialogHeader>
            <DialogTitle>Vérifier un paiement</DialogTitle>
            <DialogDescription>
              Contrôlez la transaction dans votre moyen de paiement avant de
              changer son statut.
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="executive-dialog-body">
              <div className="executive-payment-summary">
                <div>
                  <span>Étudiant</span>
                  <strong>
                    {selected.prenom} {selected.nom}
                  </strong>
                </div>
                <div>
                  <span>Formation</span>
                  <strong>
                    {selected.logiciel || selected.formation_nom || "—"}
                  </strong>
                </div>
                <div>
                  <span>Montant attendu</span>
                  <strong>{money(selected.montant)}</strong>
                </div>
                <div>
                  <span>Statut actuel</span>
                  <StatusPill status={selected.statut_paiement} />
                </div>
              </div>
              <label className="executive-field">
                Moyen de paiement
                <Input
                  value={paymentProvider}
                  onChange={(e) => setPaymentProvider(e.target.value)}
                  placeholder="MTN MoMo, Airtel Money, espèces..."
                  disabled={processing}
                />
              </label>
              <label className="executive-field">
                Référence du paiement vérifié
                <Input
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  placeholder="Référence de transaction ou reçu"
                  disabled={processing}
                />
              </label>
              <div className="executive-dialog-warning">
                <AlertCircle size={17} /> Ne validez pas un paiement sur la
                seule base d'une déclaration de l'étudiant.
              </div>
              {error && (
                <p className="executive-dialog-error" role="alert">
                  {error}
                </p>
              )}
              <div className="executive-dialog-actions">
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
                  <Check size={16} />{" "}
                  {processing ? "Traitement..." : "Valider le paiement"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
