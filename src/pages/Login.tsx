import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api, { errorMessage } from '../api';
import { useAuth } from '../auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { token, login } = useAuth();
  const navigate = useNavigate();

  if (token) return <Navigate to="/" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) return setError('Ingresa email y contraseña');
    try {
      const { data } = await api.post<{ token: string }>('/auth/login', { email, password });
      await login(data.token);
      navigate('/');
    } catch (err) {
      const msg = errorMessage(err);
      setError(msg === 'Username does not exist' ? 'Credenciales incorrectas' : msg);
    }
  };

  return (
    <div className="card">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>
        <label>
          Email
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <label>
          Contraseña
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        {error && <div className="error">{error}</div>}
        <button type="submit">Entrar</button>
        <span>¿No tienes cuenta? <Link to="/register">Regístrate</Link></span>
      </form>
    </div>
  );
}
