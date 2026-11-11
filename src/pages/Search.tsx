import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage, formatDate } from '../api';
import { addBookingId, useAuth } from '../auth';
import type { Flight } from '../types';

const toIso = (v: string) => (v ? new Date(v).toISOString() : undefined);

export default function Search() {
  const { token, user } = useAuth();
  const [filters, setFilters] = useState({ flightNumber: '', airlineName: '', from: '', to: '' });
  const [flights, setFlights] = useState<Flight[] | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState<{ id: number } | null>(null);
  const [booking, setBooking] = useState<number | null>(null);

  const search = async () => {
    setError('');
    try {
      const { data } = await api.get<{ items: Flight[] }>('/flights/search', {
        params: {
          flightNumber: filters.flightNumber || undefined,
          airlineName: filters.airlineName || undefined,
          estDepartureTimeFrom: toIso(filters.from),
          estDepartureTimeTo: toIso(filters.to),
        },
      });
      setFlights(data.items);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  useEffect(() => {
    search();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    search();
  };

  const book = async (flight: Flight) => {
    setError('');
    setMessage(null);
    setBooking(flight.id);
    try {
      const { data } = await api.post<{ id: number }>('/flights/book', { flightId: flight.id });
      if (user) addBookingId(user.email, data.id);
      setMessage({ id: data.id });
      await search();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBooking(null);
    }
  };

  const set = (k: keyof typeof filters) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFilters({ ...filters, [k]: e.target.value });

  return (
    <>
      <div className="card">
        <h2>Buscar vuelos</h2>
        <form className="filters" onSubmit={handleSubmit}>
          <label>Número de vuelo<input value={filters.flightNumber} onChange={set('flightNumber')} /></label>
          <label>Aerolínea<input value={filters.airlineName} onChange={set('airlineName')} /></label>
          <label>Salida desde<input type="datetime-local" value={filters.from} onChange={set('from')} /></label>
          <label>Salida hasta<input type="datetime-local" value={filters.to} onChange={set('to')} /></label>
          <button type="submit">Buscar</button>
        </form>
      </div>

      {error && <div className="error">{error}</div>}
      {message && (
        <div className="success">
          ¡Reserva exitosa! ID de reserva: <b>{message.id}</b> —{' '}
          <Link to={`/bookings/${message.id}`}>ver detalle</Link>
        </div>
      )}

      <div className="card">
        {flights === null ? (
          <p className="muted">Cargando...</p>
        ) : flights.length === 0 ? (
          <p className="muted">No se encontraron vuelos con esos filtros. Prueba con otros criterios. 🛫</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Vuelo</th><th>Aerolínea</th><th>Salida</th><th>Llegada</th><th>Asientos</th><th />
              </tr>
            </thead>
            <tbody>
              {flights.map(f => (
                <tr key={f.id}>
                  <td>{f.flightNumber}</td>
                  <td>{f.airlineName}</td>
                  <td>{formatDate(f.estDepartureTime)}</td>
                  <td>{formatDate(f.estArrivalTime)}</td>
                  <td>{f.availableSeats}</td>
                  <td>
                    {token && (
                      <button onClick={() => book(f)} disabled={booking !== null}>
                        {booking === f.id ? 'Reservando...' : 'Reservar'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
