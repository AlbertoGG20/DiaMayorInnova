import { useState, useEffect } from 'react';
import userService from '../../../services/userService.js';
import "./SettingsModal.css";

const SettingsModal = ({ onClose }) => {
  const [pswdIsOpen, setPswdIsOpen] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await userService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      } else {
        setError("Error al obtener el usuario actual.");
      }
    };
    fetchCurrentUser();
  }, []);

  const closeModal = () => {
    onClose();
  };

  const savePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Todos los campos deben estar completos.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las nuevas contraseñas no coinciden.");
      return;
    }

    if (!currentUser) {
      setError("Usuario no identificado.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("user[password]", newPassword);
      formData.append("user[password_confirmation]", confirmPassword);

      const response = await userService.updateUser(currentUser.id, formData);

      if (response.status === 200) {
        setSuccess("Contraseña actualizada correctamente. Por favor, vuelve a iniciar sesión.");
        setError("");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          localStorage.removeItem("site"); 
          window.location.reload(); 
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.errors?.join(", ") || "Error al actualizar la contraseña.");
    }
  };

  return (
    <div className="modal__background">
      <section className="setting__modal">
        <button onClick={closeModal} className="btn light">X</button>
        <section className="moda-settings__wrapper">
          <h2>Configuración</h2>
          <div className="user-passwd__container">
            <h3>Contraseña del Usuario</h3>
            {pswdIsOpen && (
              <div className="passwrd__inputs">
                <label className="passwd__labels">
                  Contraseña Anterior
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="123Contraseña.1"
                  />
                </label>
                <label className="passwd__labels">
                  Nueva Contraseña
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="123.contraseña.1"
                  />
                </label>
                <label className="passwd__labels">
                  Repetir Nueva Contraseña
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="123.contraseña.1"
                  />
                </label>
                {error && <div className="error__message">{error}</div>}
                {success && <div className="success__message">{success}</div>}
              </div>
            )}
          </div>

          <button onClick={savePassword} className="btn">
            <i className="fi fi-rr-exclamation"></i>
            Guardar Contraseña
          </button>
        </section>
      </section>
    </div>
  );
};

export default SettingsModal;
