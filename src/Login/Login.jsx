
import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { supabase } from "../config/supabase";
import "./Login.css";

const API_URL = "http://localhost:5001";

// Vérifier le rôle sans exposer de clé administrateur.
async function getDestination(accessToken) {
  const response = await fetch(`${API_URL}/api/admin/stats`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // Administrateur reconnu par le backend.
  if (response.ok) {
    return "/admin";
  }

  // Authentifié, mais pas administrateur.
  if (response.status === 403) {
    return "/dashboard";
  }

  if (response.status === 401) {
    throw new Error(
      "Votre session a expiré. Reconnectez-vous."
    );
  }

  throw new Error(
    "Impossible de vérifier vos autorisations."
  );
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] =
    useState(true);
  const [error, setError] = useState("");

  // Vérifier une session existante.
  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const { data, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) throw sessionError;
        if (!active) return;

        const session = data?.session;

        if (!session?.access_token) {
          localStorage.removeItem("access_token");
          setCheckingSession(false);
          return;
        }

        localStorage.setItem(
          "access_token",
          session.access_token
        );

        const destination = await getDestination(
          session.access_token
        );

        if (active) {
          navigate(destination, { replace: true });
        }
      } catch (err) {
        console.error("Erreur session :", err);

        if (active) {
          setError(
            err.message ||
              "Impossible de vérifier votre session."
          );
          setCheckingSession(false);
        }
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, [navigate]);

  // Connexion avec email et mot de passe.
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { data, error: authError } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

      if (authError) {
        throw new Error(
          "Email ou mot de passe incorrect."
        );
      }

      const accessToken = data.session?.access_token;

      if (!accessToken) {
        throw new Error(
          "Impossible de récupérer votre session."
        );
      }

      localStorage.setItem(
        "access_token",
        accessToken
      );

      // Redirection selon le rôle réel.
      const destination = await getDestination(
        accessToken
      );

      navigate(destination, { replace: true });
    } catch (err) {
      console.error("Erreur connexion :", err);

      setError(
        err.message || "Connexion impossible."
      );
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="login-page">
        <div className="login-card">
          <p>Vérification de votre session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <p>ESPACE CNL</p>
          <h1>Bienvenue 👋</h1>
          <span>
            Connectez-vous à votre espace personnel.
          </span>
        </div>

        {location.state?.message && (
          <p className="login-success">
            {location.state.message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">
              Adresse email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Mot de passe
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          {error && (
            <div
              className="login-error"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Connexion..."
              : "Se connecter"}
          </button>
        </form>

        <p className="login-register-link">
          Pas encore de compte ?{" "}
          <Link to="/inscription">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
