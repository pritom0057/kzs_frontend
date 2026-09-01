import { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/auth/me')
      .then((res) => setUser(res.data.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = (userData) => {
    if (userData.token) localStorage.setItem('kzs_token', userData.token);
    setUser(userData);
  };

  const logout = async () => {
    await axiosInstance.post('/auth/logout');
    localStorage.removeItem('kzs_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
