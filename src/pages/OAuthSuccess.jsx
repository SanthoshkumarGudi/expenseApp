import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
    }

    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }

    navigate("/dashboard");
  }, [navigate]);

  return <h2>Logging you in...</h2>;
};