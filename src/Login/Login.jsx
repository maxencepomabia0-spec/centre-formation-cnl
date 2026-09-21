import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

if (error) {
  throw new Error("Email ou mot de passe incorrect.");
}

const accessToken = data.session?.access_token;

if (!accessToken) {
  throw new Error("Impossible de récupérer la session.");
}

localStorage.setItem("access_token", accessToken);

navigate("/dashboard");

    } catch (error) {
      console.error("Erreur connexion :", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="email">
              Adresse email
            </label>

            <input
              id="email"
              type="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="login-error">
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

      </div>

    </div>
  );
}

export default Login;