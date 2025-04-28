import { useState } from "react";
import authService from "../services/authService";
import { API_BASE_URL } from "../config";

const useAuthLogic = (navigate) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("site") || "");
  const [role, setRole] = useState(null);
  const [error, setError] = useState(null);
  const [userAvatarUrl, setUserAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkTokenValidity = async (requiredRole = null) => {
    if (!token) {
      setLoading(false);
      navigate("/sign_in");
      return;
    }

    try {
      const response = await authService.validateToken(token);

      if (response.data.is_success) {
        const userData = response.data.data.user;
        const userRole = response.data.data.role;
        const newToken = response.data.data.user.authentication_token;

        if (userData && userRole) {
          setUser(userData);
          setRole(userRole);
          localStorage.setItem("site", newToken);
          setUserAvatarUrl(
            userData.featured_image ? `${API_BASE_URL}${userData.featured_image}` : null
          );

          if (requiredRole && userRole !== requiredRole) {
            setError("No tienes permiso para acceder a esta ruta.");
            navigate("/sign_in");
          }
        } else {
          setError("Información de usuario incompleta.");
        }
      } else {
        logOut();
        setError("Token inválido.");
      }
    } catch (err) {
      logOut();
      setError("Error de autenticación.");
      console.error("Error en validación de token:", err);
    } finally {
      setLoading(false);
    }
  };

  const signUpAction = async (formData) => {
    try {
      const response = await authService.signUp(formData);

      if (response.data.is_success) {
        return response;
      } else {
        throw new Error(response.data.message || "Error al registrar.");
      }
    } catch (err) {
      console.error("Error al registrar:", err);
      throw err;
    }
  };

  const signInAction = async (email, password) => {
    try {
      const credentials = btoa(`${email}:${password}`);
      const response = await authService.signIn(credentials);

      if (response.data.is_success) {
        const { user, token, role } = response.data.data;
        setUser(user);
        setToken(token);
        setRole(role);
        setUserAvatarUrl(
          user.featured_image ? `${API_BASE_URL}${user.featured_image}` : null
        );
        navigate("/home");
      } else {
        throw new Error(response.data.message || "Error al autenticar.");
      }
    } catch (err) {
      console.error("Error en login:", err);
      setError(err.response?.data?.message || "Problema al autenticar.");
    }
  };

  const logOut = async () => {
    try {
      await authService.logOut(token);
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      setUser(null);
      setToken(null);
      setRole(null);
      setUserAvatarUrl(null);
      localStorage.removeItem("site");
      navigate("/sign_in");
    }
  };

  return {
    user,
    token,
    role,
    error,
    userAvatarUrl,
    loading,
    setRole,
    setUserAvatarUrl,
    checkTokenValidity,
    signUpAction,
    signInAction,
    logOut,
    setError,
  };
};

export default useAuthLogic;
