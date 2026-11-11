import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { errorMessage, formatDate } from '../api';
import type { Booking } from '../types';

export default function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<Booking>(`/flights/book/${id}`)
      .then(r => setBooking(r.data))
      .catch(err => setError(errorMessage(err)));
  }, [id]);

  if (error) return <div className="error">No se pudo cargar la reserva: {error}</div>;
  if (!booking) return <p className="muted">Cargando...</p>;

  const rows: [string, string | number][] = [
    ['ID de reserva', booking.id],
    ['Fecha de reserva', formatDate(booking.bookingDate)],
    ['Vuelo', booking.flightNumber],
    ['Aerolínea', booking.airlineName],
    ['Salida', formatDate(booking.estDepartureTime)],
    ['Llegada', formatDate(booking.estArrivalTime)],
    ['Pasajero', `${booking.customerFirstName} ${booking.customerLastName}`],
  ];

  return (
    <div className="card">
      <h2>Detalle de reserva</h2>
      <table>
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k}><th>{k}</th><td>{v}</td></tr>
          ))}
        </tbody>
      </table>
      <p><Link to="/bookings">← Volver a mis reservas</Link></p>
    </div>
  );
}
