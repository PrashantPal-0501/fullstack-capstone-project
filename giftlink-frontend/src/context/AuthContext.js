import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  // Restore session on page load
  useEffect(() => {
    const storedToken = sessionStorage.getItem('authtoken');
    const storedUser = sessionStorage.getItem('user');
    if (storedToken && storedUser) {
      setAuthToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setAuthToken(token);
    sessionStorage.setItem('authtoken', token);
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    sessionStorage.removeItem('authtoken');
    sessionStorage.removeItem('user');
  };

  const isLoggedIn = Boolean(authToken);

  return (
    <AuthContext.Provider value={{ user, authToken, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
