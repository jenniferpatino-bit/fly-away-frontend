import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from './auth';
import Register from './pages/Register';
import Login from './pages/Login';
import Search from './pages/Search';
import MyBookings from './pages/MyBookings';
import BookingDetail from './pages/BookingDetail';

function Protected({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

function NavBar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="nav">
      <Link to="/" className="brand">✈️ Fly Away</Link>
      <Link to="/">Buscar vuelos</Link>
      {token ? (
        <>
          <Link to="/bookings">Mis reservas</Link>
          <span className="spacer" />
          {user && <span>Hola, {user.firstName} {user.lastName}</span>}
          <button onClick={handleLogout}>Cerrar sesión</button>
        </>
      ) : (
        <>
          <span className="spacer" />
          <Link to="/register">Registro</Link>
          <Link to="/login">Iniciar sesión</Link>
        </>
      )}
    </nav>
  );
}

export default function App() {
  return (
    <>
      <NavBar />
      <main className="container">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Protected><Search /></Protected>} />
          <Route path="/bookings" element={<Protected><MyBookings /></Protected>} />
          <Route path="/bookings/:id" element={<Protected><BookingDetail /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
