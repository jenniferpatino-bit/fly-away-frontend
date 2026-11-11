import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { errorMessage } from '../api';

const empty = { email: '', firstName: '', lastName: '', password: '' };
const labels: Record<keyof typeof empty, string> = {
  email: 'Email',
  firstName: 'Nombre',
  lastName: 'Apellido',
  password: 'Contraseña',
};

export default function Register() {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const missing = (Object.keys(form) as (keyof typeof empty)[]).filter(k => !form[k].trim());
    if (missing.length) return setError(`Completa: ${missing.map(k => labels[k]).join(', ')}`);
    try {
      await api.post('/users/register', form);
      setSuccess('¡Registro exitoso! Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <div className="card">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Crear cuenta</h2>
        {(Object.keys(empty) as (keyof typeof empty)[]).map(k => (
          <label key={k}>
            {labels[k]}
            <input
              type={k === 'password' ? 'password' : k === 'email' ? 'email' : 'text'}
              value={form[k]}
              onChange={e => setForm({ ...form, [k]: e.target.value })}
            />
          </label>
        ))}
        <small className="muted">
          Contraseña: 8+ caracteres, una mayúscula y un dígito. Nombre y apellido con mayúscula inicial.
        </small>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <button type="submit" disabled={!!success}>Registrarse</button>
        <span>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></span>
      </form>
    </div>
  );
}
