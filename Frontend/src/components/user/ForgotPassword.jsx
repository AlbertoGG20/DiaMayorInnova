import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { passwordService } from '../../services/passwordService';
import '../../styles/auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await passwordService.forgotPassword(email);
      setMessage(response.message);

      setTimeout(() => {
        navigate('/sign_in');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth__page">
      <div className="auth__container">
        <div className="auth__header">
          <h2 className="auth__title">
            Recuperar contraseña
          </h2>
          <p className="auth__subtitle">
            Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña
          </p>
        </div>
        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="auth__input-group">
            <div>
              <label htmlFor="email" className="sr-only">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="auth__input"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {message && (
            <div className="auth__message auth__message--success">
              <div className="auth__flex">
                <div>
                  <p>{message}</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="auth__message auth__message--error">
              <div className="auth__flex">
                <div>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn"
            >
              {loading ? 'Enviando...' : 'Enviar instrucciones'}
            </button>
          </div>

          <div className="auth__text-center auth__text-sm">
            <button
              type="button"
              onClick={() => navigate('/sign_in')}
              className="btn light"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword; 