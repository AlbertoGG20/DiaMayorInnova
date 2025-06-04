import { useState, useEffect } from 'react';
import userService from "/Ruby/DiaMayorInnova/Frontend/src/services/userService";
import "./SettingsModal.css";

const SettingsModal = ({ onClose }) => {
  const [pswdIsOpen, setPswdIsOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Récupérer l'utilisateur connecté au montage du composant
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await userService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      } else {
        setError("Erreur lors de la récupération de l'utilisateur connecté.");
      }
    };
    fetchCurrentUser();
  }, []);

  const closeModal = () => {
    onClose();
  };

  const togglePasswordFields = () => {
    setPswdIsOpen(!pswdIsOpen);
    setError("");
    setSuccess("");
  };

  const savePassword = async () => {
    // Validation de base côté client
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Tous les champs doivent être remplis.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    if (!currentUser) {
      setError("Utilisateur non identifié.");
      return;
    }

    try {
      // Préparer les données pour l'API
      const formData = new FormData();
      formData.append("user[password]", newPassword);
      formData.append("user[password_confirmation]", confirmPassword);

      // Envoyer la requête de mise à jour
      const response = await userService.updateUser(currentUser.id, formData);

      if (response.status === 200) {
        setSuccess("Mot de passe mis à jour avec succès. Veuillez vous reconnecter.");
        setError("");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPswdIsOpen(false);

        // Forcer une déconnexion après 3 secondes pour laisser le temps de voir le message
        setTimeout(() => {
          localStorage.removeItem("site"); // Supprime le token
          window.location.reload(); // Recharge la page pour déconnexion
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.errors?.join(", ") || "Erreur lors de la mise à jour du mot de passe.");
    }
  };

  return (
    <div className="modal__background">
      <section className="setting__modal">
        <button onClick={closeModal} className="btn light">X</button>
        <section className="moda-settings__wrapper">
          <h2>Configuración</h2>

          <h3>Perfil de Usuario</h3>

          <div className="user-img__container">
            <div className="user-img__img" />
            <label className="img-label__user">
              Foto de Usuario
              <select name="user-img__images" id="user-img__images">
                <option value="img1">Imagen 1</option>
              </select>
            </label>
          </div>

          <div className="user-passwd__container">
            <h3>Contraseña Usuario</h3>
            {pswdIsOpen && (
              <div className="passwrd__inputs">
                <label className="passwd__labels">
                  Contraseña Antigua
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="123Contraseña.1"
                  />
                </label>
                <label className="passwd__labels">
                  Contraseña Nueva
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="123.contraseña.1"
                  />
                </label>
                <label className="passwd__labels">
                  Repetir Contraseña
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

          <button onClick={pswdIsOpen ? savePassword : togglePasswordFields} className="btn">
            <i className="fi fi-rr-exclamation"></i>
            {pswdIsOpen ? "Guardar Contraseña" : "Modificar Contraseña"}
          </button>
        </section>
      </section>
    </div>
  );
};

export default SettingsModal;