
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Wallet,
  FileText,
  Clock3,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Copy,
} from "lucide-react";

import { supabase } from "../config/supabase";
import "./StudentProfile.css";

// URL du backend CNL.
const API = import.meta.env.VITE_API_URL || "http://localhost:5001";

// Formate les montants en FCFA.
const formatMoney = (value) =>
  `${new Intl.NumberFormat("fr-FR").format(Number(value) || 0)} FCFA`;

// Formate les dates en français.
const formatDate = (value) => {
  if (!value) return "Non renseignée";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Non renseignée";

  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Détermine le statut du paiement.
const getPaymentStatus = (status) => {
  if (status === "paye") {
    return { label: "Paiement validé", className: "success" };
  }

  if (status === "refuse") {
    return { label: "Paiement refusé", className: "danger" };
  }

  return { label: "Paiement en attente", className: "warning" };
};

// Petite ligne d'information réutilisable.
function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="student-info-row">
      <span className="student-info-icon">
        <Icon size={18} />
      </span>

      <div>
        <small>{label}</small>
        <strong>{value || "Non renseigné"}</strong>
      </div>
    </div>
  );
}

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Récupère la session Supabase et charge la fiche depuis Express.
  const loadStudent = useCallback(async () => {
    setError("");

    try {
      const { data, error: authError } =
        await supabase.auth.getSession();

      if (authError || !data.session?.access_token) {
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      }

      const response = await fetch(
        `${API}/api/admin/inscriptions/${encodeURIComponent(id)}`,
        {
          headers: {
            Authorization: `Bearer ${data.session.access_token}`,
          },
        }
      );

      const result = await response.json().catch(() => ({}));

      if (response.status === 401) {
        throw new Error("Votre session a expiré.");
      }

      if (response.status === 403) {
        throw new Error("Accès administrateur refusé.");
      }

      if (response.status === 404) {
        throw new Error("Cette inscription est introuvable.");
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Impossible de charger cette fiche."
        );
      }

      setStudent(result.inscription);
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    loadStudent();
  }, [loadStudent]);

  // Actualise les données sans quitter la fiche.
  const refresh = () => {
    setRefreshing(true);
    loadStudent();
  };

  // Ouvre une conversation WhatsApp avec l'étudiant.
  const contactWhatsApp = () => {
    if (!student?.telephone) return;

    const phone = student.telephone.replace(/[^\d]/g, "");

    if (!phone) return;

    const message = encodeURIComponent(
      `Bonjour ${student.prenom || ""}, ici le Centre National de Leadership.`
    );

    window.open(
      `https://wa.me/${phone}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // Copie l'identifiant de l'inscription.
  const copyId = async () => {
    if (!student?.id) return;

    try {
      await navigator.clipboard.writeText(String(student.id));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Impossible de copier cet identifiant.");
    }
  };

  if (loading) {
    return (
      <main className="student-profile-page">
        <div className="student-profile-state">
          <RefreshCw className="student-spin" size={28} />
          <h2>Chargement de la fiche</h2>
          <p>Récupération des informations de l'étudiant...</p>
        </div>
      </main>
    );
  }

  if (error || !student) {
    return (
      <main className="student-profile-page">
        <div className="student-profile-state">
          <AlertCircle size={34} />

          <h2>Fiche indisponible</h2>
          <p>{error || "Aucune information disponible."}</p>

          <button
            className="student-primary-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={17} />
            Retour
          </button>

          <button className="student-secondary-button" onClick={refresh}>
            Réessayer
          </button>
        </div>
      </main>
    );
  }

  const payment = getPaymentStatus(student.statut_paiement);
  const amount = Number(student.montant) || 0;
  const paid = student.statut_paiement === "paye" ? amount : 0;
  const remaining = Math.max(amount - paid, 0);

  const fullName =
    `${student.prenom || ""} ${student.nom || ""}`.trim() ||
    "Étudiant sans nom";

  const initials =
    `${student.prenom?.[0] || ""}${student.nom?.[0] || ""}`.toUpperCase() ||
    "ET";

  return (
    <main className="student-profile-page">

      {/* En-tête de la fiche */}
      <header className="student-profile-heading">
        <div>
          <div className="student-breadcrumb">
            Administration <span>/</span> Étudiants <span>/</span> Profil
          </div>

          <h1>Fiche étudiant</h1>
          <p>Informations et suivi de l'inscription</p>
        </div>

        <div className="student-heading-actions">
          <button
            className="student-secondary-button"
            onClick={refresh}
            disabled={refreshing}
          >
            <RefreshCw
              size={16}
              className={refreshing ? "student-spin" : ""}
            />
            Actualiser
          </button>

          <button
            className="student-secondary-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
            Retour
          </button>
        </div>
      </header>

      {/* Carte principale d'identité */}
      <section className="student-identity-card">
        <div className="student-avatar-large">{initials}</div>

        <div className="student-identity-content">
          <span className="student-eyebrow">PROFIL ÉTUDIANT</span>
          <h2>{fullName}</h2>

          <div className="student-identity-contact">
            <span><Mail size={15} /> {student.email || "Email non renseigné"}</span>
            <span><Phone size={15} /> {student.telephone || "Téléphone non renseigné"}</span>
            <span><MapPin size={15} /> {student.ville || "Ville non renseignée"}</span>
          </div>
        </div>

        <div className={`student-payment-badge ${payment.className}`}>
          {student.statut_paiement === "paye"
            ? <CheckCircle2 size={17} />
            : <AlertCircle size={17} />}
          {payment.label}
        </div>
      </section>

      {/* Contenu principal */}
      <div className="student-profile-grid">

        <div className="student-profile-main">

          {/* Formation */}
          <section className="student-profile-card">
            <div className="student-card-heading">
              <div className="student-card-icon">
                <GraduationCap size={21} />
              </div>

              <div>
                <h3>Formation et inscription</h3>
                <p>Parcours académique déclaré</p>
              </div>
            </div>

            <div className="student-info-grid">
              <InfoRow
                icon={GraduationCap}
                label="Formation choisie"
                value={student.logiciel || student.formation_nom}
              />

              <InfoRow
                icon={FileText}
                label="Filière"
                value={student.filiere}
              />

              <InfoRow
                icon={ShieldCheck}
                label="Formule"
                value={student.offre}
              />

              <InfoRow
                icon={CalendarDays}
                label="Date d'inscription"
                value={formatDate(student.created_at)}
              />
            </div>
          </section>

          {/* Informations personnelles */}
          <section className="student-profile-card">
            <div className="student-card-heading">
              <div className="student-card-icon">
                <ShieldCheck size={21} />
              </div>

              <div>
                <h3>Informations personnelles</h3>
                <p>Coordonnées enregistrées</p>
              </div>
            </div>

            <div className="student-info-grid">
              <InfoRow icon={Mail} label="Adresse email" value={student.email} />
              <InfoRow icon={Phone} label="Téléphone" value={student.telephone} />
              <InfoRow icon={MapPin} label="Ville" value={student.ville} />
              <InfoRow icon={GraduationCap} label="Profil déclaré" value={student.profil} />
            </div>
          </section>

          {/* Informations de paiement */}
          <section className="student-profile-card">
            <div className="student-card-heading">
              <div className="student-card-icon">
                <Wallet size={21} />
              </div>

              <div>
                <h3>Situation financière</h3>
                <p>État du paiement enregistré</p>
              </div>
            </div>

            <div className="student-finance-grid">
              <div>
                <small>Montant total</small>
                <strong>{formatMoney(amount)}</strong>
              </div>

              <div>
                <small>Montant enregistré comme payé</small>
                <strong className="student-paid-amount">
                  {formatMoney(paid)}
                </strong>
              </div>

              <div>
                <small>Reste à payer</small>
                <strong>{formatMoney(remaining)}</strong>
              </div>
            </div>

            <div className="student-payment-progress">
              <div
                style={{
                  width: `${amount > 0 ? (paid / amount) * 100 : 0}%`,
                }}
              />
            </div>

            <div className="student-payment-details">
              <p>
                <span>Statut</span>
                <strong>{payment.label}</strong>
              </p>

              <p>
                <span>Fournisseur</span>
                <strong>{student.provider_paiement || "Non renseigné"}</strong>
              </p>

              <p>
                <span>Référence</span>
                <strong>{student.reference_paiement || "Non renseignée"}</strong>
              </p>

              <p>
                <span>Dernière mise à jour</span>
                <strong>{formatDate(student.updated_at)}</strong>
              </p>
            </div>

            <p className="student-payment-notice">
              <ShieldCheck size={16} />
              Le statut affiché correspond à la valeur enregistrée dans la base.
              Il ne constitue pas une vérification automatique auprès d'un opérateur.
            </p>
          </section>
        </div>

        {/* Colonne latérale */}
        <aside className="student-profile-side">

          <section className="student-profile-card student-quick-actions">
            <div className="student-card-heading">
              <div className="student-card-icon">
                <ExternalLink size={20} />
              </div>

              <div>
                <h3>Actions rapides</h3>
                <p>Contacter et consulter</p>
              </div>
            </div>

            <button
              className="student-whatsapp-button"
              onClick={contactWhatsApp}
              disabled={!student.telephone}
            >
              <Phone size={17} />
              Contacter sur WhatsApp
            </button>

            <button
              className="student-secondary-button student-copy-button"
              onClick={copyId}
            >
              <Copy size={16} />
              {copied ? "Identifiant copié" : "Copier l'identifiant"}
            </button>
          </section>

          <section className="student-profile-card">
            <div className="student-card-heading">
              <div className="student-card-icon">
                <Clock3 size={20} />
              </div>

              <div>
                <h3>Suivi du dossier</h3>
                <p>Informations techniques</p>
              </div>
            </div>

            <div className="student-followup-list">
              <div>
                <span>Identifiant</span>
                <strong title={String(student.id)}>
                  {String(student.id).slice(0, 12)}...
                </strong>
              </div>

              <div>
                <span>Création du dossier</span>
                <strong>{formatDate(student.created_at)}</strong>
              </div>

              <div>
                <span>Dernière modification</span>
                <strong>{formatDate(student.updated_at)}</strong>
              </div>
            </div>
          </section>

          <section className="student-profile-brand">
            <GraduationCap size={34} />
            <strong>CNL.</strong>
            <span>CENTRE NATIONAL DE LEADERSHIP</span>
            <small>Former · Innover · Réussir</small>
          </section>

        </aside>
      </div>
    </main>
  );
}
