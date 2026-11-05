import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import { motion } from "motion/react";
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
  ChevronRight,
  ShieldCheck,
  Check,
  Ban,
  ArrowUpRight,
  Sun,
  Moon,
  Download,
  CalendarDays,
  Building2,
  ArrowRight,
  ChevronLeft,
  ChartNoAxesCombined,
  ClipboardList,
  LockKeyhole,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  "#0b7f88",
  "#7667f5",
  "#24bea3",
  "#f4af48",
  "#8c9bb6",
  "#e16d9b",
];

// Transforme une clé de mois (AAAA-MM) en libellé français pour le graphique.
function formatMonthLabel(monthKey) {
  const [year, month] = String(monthKey || "").split("-").map(Number);
  if (!year || !month) return "—";

  return new Date(year, month - 1, 1).toLocaleDateString("fr-FR", {
    month: "short",
  });
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

/**
 * Graphique mensuel global.
 * Les chiffres viennent du backend (agrégés directement dans PostgreSQL),
 * et non de la seule page d'étudiants actuellement affichée.
 */
function EnrollmentChart({ monthly = [], total }) {
  const [period, setPeriod] = useState(6);

  const data = useMemo(() => {
    return monthly.slice(-period).map((entry) => ({
      ...entry,
      name: formatMonthLabel(entry.key),
    }));
  }, [monthly, period]);

  return (
    <div className="executive-panel executive-enrollment">
      <SectionHeader
        eyebrow="ANALYSE"
        title="Évolution des inscriptions"
        description="Historique global des inscriptions enregistrées"
        actions={
          <select
            className="executive-period"
            value={period}
            onChange={(event) => setPeriod(Number(event.target.value))}
            aria-label="Période du graphique"
          >
            <option value={6}>6 mois</option>
            <option value={12}>12 mois</option>
          </select>
        }
      />

      <div className="executive-chart-total">
        <strong>{number(total)}</strong>
        <span>inscription(s) au total</span>
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
        Analyse calculée sur l'ensemble des inscriptions de la base.
      </p>
    </div>
  );
}

/**
 * Répartition globale des formations.
 * L'API fournit une liste agrégée pour toutes les inscriptions.
 */
function PopularChart({ items = [] }) {
  const { segments, total } = useMemo(() => {
    const sorted = [...items]
      .map((item) => ({
        name: item.name || "Non renseigné",
        value: Number(item.value) || 0,
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);

    const top = sorted.slice(0, 5);
    const rest = sorted.slice(5).reduce((sum, item) => sum + item.value, 0);

    if (rest > 0) top.push({ name: "Autres", value: rest });

    return {
      segments: top,
      total: sorted.reduce((sum, item) => sum + item.value, 0),
    };
  }, [items]);

  return (
    <div className="executive-panel executive-popular">
      <SectionHeader
        eyebrow="FORMATIONS"
        title="Formations populaires"
        description="Répartition globale des inscriptions"
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
                  {segments.map((segment, index) => (
                    <Cell
                      key={segment.name}
                      fill={PALETTE[index % PALETTE.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} inscription(s)`, "Nombre"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="executive-donut-center">
              <strong>{number(total)}</strong>
              <span>inscriptions</span>
            </div>
          </div>
          <div className="executive-legend">
            {segments.map((segment, index) => (
              <div className="executive-legend-row" key={segment.name}>
                <span
                  className="executive-legend-dot"
                  style={{ background: PALETTE[index % PALETTE.length] }}
                />
                <span title={segment.name}>{segment.name}</span>
                <strong>{Math.round((segment.value / total) * 100)} %</strong>
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

/**
 * Tableau des inscriptions.
 * Important : il n'effectue plus de découpage local avec Array.slice().
 * Il affiche la page renvoyée par le backend et lui demande la suivante.
 */
function StudentsTable({
  rows,
  onPayment,
  onViewStudent,
  enableActions = false,
  showControls = false,
  totalCount = 0,
  pagination = null,
  onPageChange,
  onPageSizeChange,
  onExport,
  exporting = false,
}) {
  const currentPage = pagination?.page || 1;
  const pageSize = pagination?.limit || 20;
  const totalPages = pagination?.totalPages || 1;
  const total = Number(totalCount) || 0;
  const firstRow = total ? (currentPage - 1) * pageSize + 1 : 0;
  const lastRow = Math.min(currentPage * pageSize, total);

  return (
    <>
      {showControls && (
        <div className="executive-table-controls">
          <span>{number(total)} résultat(s) correspondant aux filtres</span>
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              disabled={exporting || total === 0}
            >
              <Download size={14} />
              {exporting ? "Préparation..." : "Exporter CSV"}
            </Button>
            <label>
              Par page{" "}
              <select
                value={pageSize}
                onChange={(event) => onPageSizeChange(Number(event.target.value))}
                aria-label="Nombre d'étudiants par page"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
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
              
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
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
                {(enableActions || onViewStudent) && (
  <td>
    <div className="executive-row-actions">
      {onViewStudent && (
        <button
          className="executive-row-button"
          onClick={() => onViewStudent(item)}
          title="Consulter la fiche de cet étudiant"
        >
          <BookOpen size={16} /> Fiche
        </button>
      )}

      {enableActions && (
        <button
          className="executive-row-button"
          onClick={() => onPayment(item)}
          title="Examiner le paiement"
        >
          <Eye size={16} /> Gérer
        </button>
      )}
    </div>
  </td>
)}
              </tr>
            ))}

            {!rows.length && (
              <tr>
                <td colSpan={enableActions || onViewStudent ? 7 : 6} className="executive-empty">
                  Aucune inscription correspondant à vos critères.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showControls && pagination && (
        <div className="executive-table-footer">
          <span>
            {firstRow}–{lastRow} sur {number(total)} inscription(s)
          </span>
          <div className="executive-pages">
            <button
              disabled={!pagination.hasPreviousPage}
              onClick={() => onPageChange(currentPage - 1)}
              aria-label="Page précédente"
            >
              <ChevronLeft size={16} />
            </button>
            <span>
              Page {number(currentPage)} / {number(totalPages)}
            </span>
            <button
              disabled={!pagination.hasNextPage}
              onClick={() => onPageChange(currentPage + 1)}
              aria-label="Page suivante"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
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

  // --------------------------------------------------
  // ÉTAT DE L'INTERFACE
  // Ces valeurs contrôlent l'affichage, les filtres et la pagination.
  // --------------------------------------------------
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("cnl-admin-theme") === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  const [section, setSection] = useState("overview");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState("tous");

  // Pagination pilotée par l'API (et non par un découpage local du tableau).
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // --------------------------------------------------
  // DONNÉES ET ÉTATS DE CHARGEMENT
  // --------------------------------------------------
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState({ monthly: [], popular: [] });
  const [inscriptions, setInscriptions] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const hasLoadedOnce = useRef(false);
  const latestRequestId = useRef(0);

  // --------------------------------------------------
  // ÉTAT DE LA FENÊTRE DE VALIDATION DE PAIEMENT
  // --------------------------------------------------
  const [selected, setSelected] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentProvider, setPaymentProvider] = useState("");

  // Mémorise le thème choisi sur cet ordinateur.
  useEffect(() => {
    try {
      localStorage.setItem("cnl-admin-theme", theme);
    } catch {
      // Le tableau de bord reste utilisable si le stockage est indisponible.
    }
  }, [theme]);

  // Évite d'envoyer une requête à chaque caractère saisi.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [search]);

  // --------------------------------------------------
  // AUTHENTIFICATION : récupère le jeton de session Supabase.
  // Le backend vérifie ensuite le rôle administrateur.
  // --------------------------------------------------
  const getToken = useCallback(async () => {
    const { data, error: authError } = await supabase.auth.getSession();

    if (authError || !data.session?.access_token) {
      throw new Error("Session expirée. Reconnectez-vous.");
    }

    setEmail(data.session.user?.email || "");
    return data.session.access_token;
  }, []);

  // --------------------------------------------------
  // CHARGEMENT DU DASHBOARD
  // Charge les statistiques globales et une seule page d'inscriptions.
  // --------------------------------------------------
  const loadData = useCallback(async () => {
    // Un identifiant empêche une réponse réseau ancienne d'écraser la plus récente.
    const requestId = ++latestRequestId.current;

    if (hasLoadedOnce.current) setRefreshing(true);
    else setLoading(true);

    setError("");

    try {
      const token = await getToken();
      try {
        localStorage.setItem("access_token", token);
      } catch {
        // Le jeton reste utilisé dans l'en-tête même si le stockage est bloqué.
      }

      const headers = { Authorization: `Bearer ${token}` };

      // Prépare les paramètres envoyés au backend.
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pageSize),
      });

      if (debouncedSearch) params.set("q", debouncedSearch);
      if (filter !== "tous") params.set("statut_paiement", filter);

      // Les statistiques restent globales ; la liste est paginée et filtrée.
      const [statsResponse, listResponse] = await Promise.all([
        fetch(`${API}/api/admin/stats`, { headers }),
        fetch(`${API}/api/admin/inscriptions?${params.toString()}`, { headers }),
      ]);

      if (!statsResponse.ok || !listResponse.ok) {
        const statusCode = !statsResponse.ok
          ? statsResponse.status
          : listResponse.status;

        if (statusCode === 401) {
          throw new Error("Session expirée. Reconnectez-vous.");
        }

        if (statusCode === 403) {
          throw new Error("Accès administrateur refusé.");
        }

        throw new Error("Impossible de récupérer les données administrateur CNL.");
      }

      const [statsData, listData] = await Promise.all([
        statsResponse.json(),
        listResponse.json(),
      ]);

      // Une pagination absente indique que l'ancienne route backend est encore active.
      if (!listData.pagination || !Array.isArray(listData.inscriptions)) {
        throw new Error(
          "L'API utilise encore l'ancienne version. Remplacez admin.routes.js par la version paginée.",
        );
      }

      // Ignore cette réponse si une recherche ou une page plus récente est déjà partie.
      if (requestId !== latestRequestId.current) return;

      setStats(statsData.stats || null);
      setAnalytics(statsData.analytics || { monthly: [], popular: [] });
      setInscriptions(listData.inscriptions);
      setPagination(listData.pagination);
    } catch (loadError) {
      if (requestId === latestRequestId.current) {
        setError(loadError.message || "Erreur de chargement des données.");
      }
    } finally {
      if (requestId === latestRequestId.current) {
        hasLoadedOnce.current = true;
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [getToken, page, pageSize, debouncedSearch, filter]);

  // Recharge automatiquement les données quand la page ou les filtres changent.
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Le backend effectue déjà la recherche, le filtre et le tri.
  // Ces alias gardent le reste du JSX lisible sans refaire le filtrage local.
  const filtered = inscriptions;
  const sorted = inscriptions;

  const navigateSection = (id) => {
    setSection(id);
    setMobileMenu(false);
    setSearch("");
    setDebouncedSearch("");
    setFilter("tous");
    setPage(1);
  };
  // Exporte toutes les inscriptions correspondant aux filtres actuels.
  // Chaque appel récupère 100 lignes ; on parcourt toutes les pages du serveur.
  const exportAllFiltered = async () => {
    if (exporting) return;

    setExporting(true);
    setError("");

    try {
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };
      const allRows = [];
      let currentExportPage = 1;
      let totalPages = 1;

      do {
        const params = new URLSearchParams({
          page: String(currentExportPage),
          limit: "100",
        });

        // Utilise les valeurs visibles dans les champs de recherche et de filtre.
        if (search.trim()) params.set("q", search.trim());
        if (filter !== "tous") params.set("statut_paiement", filter);

        const response = await fetch(
          `${API}/api/admin/inscriptions?${params.toString()}`,
          { headers },
        );

        if (!response.ok) {
          throw new Error("Impossible de préparer l'export des inscriptions.");
        }

        const result = await response.json();

        if (!result.pagination || !Array.isArray(result.inscriptions)) {
          throw new Error("La réponse de l'API ne contient pas la pagination attendue.");
        }

        allRows.push(...result.inscriptions);
        totalPages = result.pagination.totalPages;
        currentExportPage += 1;
      } while (currentExportPage <= totalPages);

      if (!allRows.length) {
        setError("Aucune inscription à exporter pour ces critères.");
        return;
      }

      exportCSV(allRows);
    } catch (exportError) {
      setError(exportError.message || "Erreur pendant l'export CSV.");
    } finally {
      setExporting(false);
    }
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
  // Ouvre la fiche détaillée de l'étudiant sélectionné.
const openStudentProfile = (item) => {
  if (!item?.id) {
    setError("Identifiant de l'étudiant introuvable.");
    return;
  }

  navigate(`/admin/inscriptions/${item.id}`);
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
                setPage(1);
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
                      monthly={analytics.monthly || []}
                      total={stats?.totalInscriptions ?? pagination.total}
                    />
                    <PopularChart items={analytics.popular || []} />
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
                        onViewStudent={openStudentProfile}
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
                          <button onClick={exportAllFiltered} disabled={exporting}>
                            <span>
                              <Download size={19} />
                            </span>
                            {exporting ? "Préparation de l'export..." : "Exporter les inscriptions"} <ArrowRight size={15} />
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
                      {number(pagination.total)} inscription(s) correspondant aux critères
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
                      onChange={(e) => {
                        setFilter(e.target.value);
                        setPage(1);
                      }}
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
                    rows={filtered}
                    totalCount={pagination.total}
                    pagination={pagination}
                    onPageChange={setPage}
                    onPageSizeChange={(size) => {
                      setPageSize(size);
                      setPage(1);
                    }}
                    enableActions={section === "payments"}
                    onPayment={openPayment}
                    showControls
                    onExport={exportAllFiltered}
                    exporting={exporting}
                    onViewStudent={openStudentProfile}
                  />
                )}
                <p className="executive-quiet-note">
                  Pagination côté serveur : les pages sont chargées directement depuis Supabase.
                  Les filtres et l'export CSV portent sur l'ensemble des résultats correspondants.
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
