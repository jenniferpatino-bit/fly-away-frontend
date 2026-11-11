import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { AxiosResponse } from 'axios';
import api, { formatDate } from '../api';
import { getBookingIds, useAuth } from '../auth';
import type { Booking } from '../types';

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[] | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.allSettled(getBookingIds(user.email).map(id => api.get<Booking>(`/flights/book/${id}`))).then(
      results =>
        setBookings(
          results
            .filter((r): r is PromiseFulfilledResult<AxiosResponse<Booking>> => r.status === 'fulfilled')
            .map(r => r.value.data),
        ),
    );
  }, [user]);

  return (
    <div className="card">
      <h2>Mis reservas</h2>
      {bookings === null ? (
        <p className="muted">Cargando...</p>
      ) : bookings.length === 0 ? (
        <p className="muted">Aún no tienes reservas. <Link to="/">Busca un vuelo</Link>.</p>
      ) : (
        <table>
          <thead>
            <tr><th>Reserva</th><th>Vuelo</th><th>Aerolínea</th><th>Salida</th><th /></tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td>#{b.id}</td>
                <td>{b.flightNumber}</td>
                <td>{b.airlineName}</td>
                <td>{formatDate(b.estDepartureTime)}</td>
                <td><Link to={`/bookings/${b.id}`}>Ver detalle</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
