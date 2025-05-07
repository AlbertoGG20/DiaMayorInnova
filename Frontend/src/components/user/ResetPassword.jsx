import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { passwordService } from '../../services/passwordService';
import '../../styles/auth.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('reset_password_token');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError('Token no válido');
      setTimeout(() => {
        navigate('/forgot-password');
      }, 3000);
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (password !== passwordConfirmation) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      const response = await passwordService.resetPassword(token, password, passwordConfirmation);
      setMessage(response.message || 'Contraseña actualizada correctamente');
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate('/sign_in');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Error al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth__page">
        <div className="auth__container">
          <div className="auth__header">
            <h2 className="auth__title">
              Enlace inválido
            </h2>
            <p className="auth__subtitle">
              El enlace para restablecer la contraseña no es válido o ha expirado.
            </p>
          </div>
          <div className="auth__text-center">
            <button
              onClick={() => navigate('/forgot-password')}
              className="btn light"
            >
              Solicitar nuevo enlace
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth__page">
      <div className="auth__container">
        <div className="auth__header">
          <h2 className="auth__title">
            Restablecer contraseña
          </h2>
          <p className="auth__subtitle">
            Ingresa tu nueva contraseña
          </p>
        </div>
        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="auth__input-group">
            <div>
              <label htmlFor="password" className="sr-only">
                Nueva contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="auth__input"
                placeholder="Nueva contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="auth__mt-4">
              <label htmlFor="password_confirmation" className="sr-only">
                Confirmar contraseña
              </label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                required
                className="auth__input"
                placeholder="Confirmar contraseña"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
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
              {loading ? 'Procesando...' : 'Restablecer contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword; 