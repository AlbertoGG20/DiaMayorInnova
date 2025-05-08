import { createContext, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthLogic from "../hooks/useAuthLogic";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuthLogic(navigate);

  const publicRoutes = ['/sign_in', '/forgot-password', '/reset-password'];

  useEffect(() => {
    if (publicRoutes.includes(location.pathname)) {
      return;
    }

    auth.checkTokenValidity();
    if (auth.token) {
      localStorage.setItem("site", auth.token);
    } else {
      localStorage.removeItem("site");
      navigate('/sign_in');
    }
  }, [auth.token, location.pathname, navigate]);

  if (auth.loading && !publicRoutes.includes(location.pathname)) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);