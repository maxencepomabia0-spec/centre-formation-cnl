import { useEffect, useState } from "react";
import { Link, useNavigate,useLocation } from "react-router-dom";
import { supabase } from "../config/supabase";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState("");

  // Vérifier si l'étudiant est déjà connecté.
  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (!active) return;
         if (error) {
          throw error;
        }

        const session = data?.session;

        if (session?.access_token) {
          localStorage.setItem(
            "access_token",
            session.access_token
          );

          navigate("/dashboard", { replace: true });
          return;
        }

        localStorage.removeItem("access_token");
        setCheckingSession(false);
      } catch (error) {
        console.error("Erreur vérification session :", error);

        if (active) {
          setError("Impossible de vérifier votre session.");
          setCheckingSession(false);
        }
      }
    };

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
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (error) {
        throw new Error("Email ou mot de passe incorrect.");
      }

      const accessToken = data.session?.access_token;

      if (!accessToken) {
        throw new Error(
          "Impossible de récupérer votre session."
        );
      }

      // Compatibilité avec l'API dashboard actuelle.
      localStorage.setItem("access_token", accessToken);

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Erreur connexion :", error);
      setError(error.message || "Connexion impossible.");
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
          <p>ESPACE ÉTUDIANT</p>
          <h1>Bienvenue 👋</h1>
          <span>
            Connectez-vous à votre espace de formation.
          </span>
        </div>
        {location.state?.message && (
  <p className="login-success">
    {location.state.message}
  </p>
)}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Adresse email</label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
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