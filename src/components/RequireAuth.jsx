import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../config/supabase";

function RequireAuth({ children }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (!active) return;

        const session = data?.session;

        if (error || !session?.access_token) {
          localStorage.removeItem("access_token");
          setStatus("signed-out");
          return;
        }

        // Synchronise le token pour l'API existante.
        localStorage.setItem(
          "access_token",
          session.access_token
        );

        setStatus("signed-in");
      } catch (error) {
        console.error("Erreur vérification session :", error);

        if (active) {
          localStorage.removeItem("access_token");
          setStatus("signed-out");
        }
      }
    };

    checkSession();

    return () => {
      active = false;
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <p>Vérification de votre session...</p>
        </div>
      </div>
    );
  }

  if (status === "signed-out") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RequireAuth;