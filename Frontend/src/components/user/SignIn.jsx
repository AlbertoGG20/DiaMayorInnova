import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import "./Sign.css";

const SignIn = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmitEvent = (e) => {
    e.preventDefault();

    if (!input.email || !input.password) {
      setErrorMessage("Por favor, complete todos los campos.");
      return;
    }
    auth
      .signInAction(input.email.toLowerCase(), input.password)
      .then((response) => {
        const user = response?.data?.data?.user;

        if (user) {
          auth.setRole(user.role);

          if (user.featured_image) {
            const avatarUrl = `${API_BASE_URL}/${user.featured_image}`;
            auth.setUserAvatarUrl(avatarUrl);
          }
          setErrorMessage("");
          setSuccessMessage("Inicio de sesión exitoso.");
          navigate("/home");
        } else {
          setErrorMessage("No se pudo obtener información del usuario.");
        }
      })
      .catch((error) => {
        console.error("Error durante el inicio de sesión:", error);
        setErrorMessage("Hubo un error durante el inicio de sesión. Verifique sus credenciales.");
        setSuccessMessage("");
      });
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <main className="log__main">
      <div className="log__section">
        <img className="log__img" src="/images/log.jpg" alt="Imagen de inicio de sesión" />
        <div className="log__container">
          <h1 className="log__tittle">Iniciar Sesión</h1>
          <form className="log__form" onSubmit={handleSubmitEvent}>
            <div className="inputs__wrapper">
              <div className="form_control">
                <label className="input__wrapper" htmlFor="user-email">Email:
                  <input
                    type="email"
                    id="user-email"
                    name="email"
                    placeholder="example@yahoo.com"
                    aria-describedby="user-email"
                    aria-invalid="false"
                    onChange={handleInput}
                  />
                </label>
              </div>
              <div className="form_control">
                <label className="input__wrapper" htmlFor="password">Password:
                  <input
                    type="password"
                    id="password"
                    name="password"
                    aria-describedby="user-password"
                    aria-invalid="false"
                    onChange={handleInput}
                  />
                </label>
              </div>
            </div>
            {errorMessage && <div className="error__message">{errorMessage}</div>}
            {successMessage && <div style={{ color: "green", marginBottom: "10px" }}>{successMessage}</div>}
            <button className="btn light">Iniciar Sesión</button>
            <div className="forgot-password-link">
              <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
            </div>
          </form>
        </div>
      </div>
      <div className="logos_section">
        <img src="/images/logo_gobcan_edu.png" alt="Logo de la Consejería de Educación del Gobierno de Canarias" />
        <div className="logos_section__group">
          <img src="/images/logo_ies_sb.png" alt="Logo del IES Santa Brígida" />
          <img src="/images/logo_ies_er.png" alt="Logo del IES El Rincón" />
        </div>
        <img src="/images/logo_usabi.png" alt="Logo de Usabi" />
        <img src="/images/logo_ulpgc.png" alt="Logo de la Universidad de Las Palmas de Gran Canaria" />
      </div>
    </main>
  );
};

export default SignIn;
