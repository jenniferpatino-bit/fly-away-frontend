export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface Flight {
  id: number;
  flightNumber: string;
  airlineName: string;
  estDepartureTime: string;
  estArrivalTime: string;
  availableSeats: number;
}

export interface Booking {
  id: number;
  bookingDate: string;
  flightId: number;
  flightNumber: string;
  airlineName: string;
  estDepartureTime: string;
  estArrivalTime: string;
  customerId: number;
  customerFirstName: string;
  customerLastName: string;
}
