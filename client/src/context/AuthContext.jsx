import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('lifedrop_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('lifedrop_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error('Token expired');
          return res.json();
        })
        .then(data => {
          setUser(data.user);
          localStorage.setItem('lifedrop_user', JSON.stringify(data.user));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to login');
    }
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('lifedrop_token', data.token);
    localStorage.setItem('lifedrop_user', JSON.stringify(data.user));
    return data.user;
  };

  const register = async (payload) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      const errDetails = data.details ? data.details.map(d => d.message).join(', ') : data.error;
      throw new Error(errDetails || 'Failed to register');
    }
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('lifedrop_token', data.token);
    localStorage.setItem('lifedrop_user', JSON.stringify(data.user));
    return data.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('lifedrop_token');
    localStorage.removeItem('lifedrop_user');
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('lifedrop_user', JSON.stringify(data.user));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider value={{
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      role: user?.role,
      login,
      register,
      logout,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
