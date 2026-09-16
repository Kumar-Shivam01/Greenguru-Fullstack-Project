import { createContext, useContext, useState, useEffect } from 'react'
import { login as loginApi, logout as logoutApi,register as registerApi, getCurrentUser } from '../api/authApi'

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const checkAuth = async () => {
        try {
          const response = await getCurrentUser();
          if (cancelled) return;
          // If the API returns a wrapped object with .data use it, otherwise use the response directly
          const userData = response?.data ?? response;
          setUser(userData);
        } catch (error) {
          if (cancelled) return;
          console.error("Auth check failed:", error);
          setUser(null);
        } finally {
          if (!cancelled) setLoading(false);
        }
    };
    checkAuth();
    return () => { cancelled = true; };
  }, []);

  const login = async (credentials) => {
    const response = await loginApi(credentials);
    if (response.status === 'success') {
      setUser(response.data);
      setLoading(false);
    }
    return response;
  };
  const signup = async (formData)=>{
    const response = await registerApi(formData)
    if(response.status === 'success'){
      setUser(response.data)
      setLoading(false)
    }
    return response
  }

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        signup
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
