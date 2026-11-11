import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import api from './api';
import type { User } from './types';

interface AuthState {
  token: string | null;
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!token) return setUser(null);
    api.get<User>('/users/current').then(r => setUser(r.data)).catch(() => setUser(null));
  }, [token]);

  const login = async (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}

const bookingsKey = (email: string) => `bookings:${email}`;

export function getBookingIds(email: string): number[] {
  return JSON.parse(localStorage.getItem(bookingsKey(email)) ?? '[]');
}

export function addBookingId(email: string, id: number) {
  const ids = getBookingIds(email);
  if (!ids.includes(id)) localStorage.setItem(bookingsKey(email), JSON.stringify([...ids, id]));
}
