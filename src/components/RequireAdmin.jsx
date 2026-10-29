
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API_URL = "http://localhost:5001";

export default function RequireAdmin({ children }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    async function verifyAdmin() {
      const token = localStorage.getItem("access_token");

      if (!token) {
        if (active) setStatus("unauthenticated");
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/admin/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!active) return;

        if (response.status === 401) {
          setStatus("unauthenticated");
        } else if (response.status === 403) {
          setStatus("forbidden");
        } else if (response.ok) {
          setStatus("authorized");
        } else {
          setStatus("error");
        }
      } catch {
        if (active) setStatus("error");
      }
    }

    verifyAdmin();

    return () => {
      active = false;
    };
  }, []);

  if (status === "loading") {
    return <p>Vérification des autorisations...</p>;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  if (status === "forbidden") {
    return <Navigate to="/dashboard" replace />;
  }

  if (status === "error") {
    return <p>Impossible de vérifier les autorisations.</p>;
  }

  return children;
}
