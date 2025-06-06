import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { passwordService } from '../../services/passwordService';
import { forgotPassword as texts } from '../../texts/user';
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
          <h2 className="auth__title">{texts.title}</h2>
          <p className="auth__subtitle">{texts.subtitle}</p>
        </div>
        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="auth__input-group">
            <div>
              <label htmlFor="email" className="sr-only">{texts.email}</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="auth__input"
                placeholder={texts.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col-rev-sm gap-s">
            <button
              type="button"
              onClick={() => navigate('/sign_in')}
              className="btn light"
            >
              {texts.backToLogin}
            </button>

            <button
              type="submit"
              className="btn"
              disabled={loading}
            >
              {texts.submit}
            </button>
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
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;