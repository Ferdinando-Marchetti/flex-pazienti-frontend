import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios, { type AxiosResponse } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337/";

// ✅ Tipi
interface PatientUser {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  data_nascita: string;
  genere: 'M' | 'F' | 'Altro';
  altezza: number | null;
  peso: number | null;
  diagnosi: string | null;
}

interface ApiResponse<T> {
  data: T;
}

interface AuthContextType {
  user: PatientUser | null;
  login: (email: string, password: string) => Promise<void>;
  checkEmail: (email: string) => Promise<void>;
  registerComplete: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // serve per cookie del refresh token
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<PatientUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // --- Rotte da escludere dal controllo automatico ---
  const ExcludeCheck = ["/login"];

  // --- Logout forzato centralizzato ---
  const handleForceLogout = (redirect = true) => {
    setUser(null);
    setAccessToken(null);
    if (redirect) navigate('/login', { replace: true });
  };

  // --- INTERCEPTOR RISPOSTE ---
  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Gestione refresh token automatico
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const { data }: AxiosResponse<ApiResponse<{ accessToken: string; user: PatientUser }>> =
              await api.post('/pazienti/auth/refreshToken');
            const { accessToken, user } = data.data;
            setAccessToken(accessToken);
            setUser(user);

            // Aggiorna token nella richiesta originale e ripeti
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            console.warn("❌ Refresh token fallito, logout");
            handleForceLogout();
            return Promise.reject(refreshError);
          }
        }

        if (error.response?.status === 400) {
          handleForceLogout();
        }

        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(responseInterceptor);
  }, [navigate]);

  // --- INTERCEPTOR RICHIESTE (aggiunge token se presente) ---
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (accessToken && !config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    return () => api.interceptors.request.eject(requestInterceptor);
  }, [accessToken]);

  // --- CHECK INIZIALE: tenta refresh all'avvio (se non in /auth/*) ---
  useEffect(() => {
    const shouldCheck = !ExcludeCheck.some((path) => location.pathname.startsWith(path));

    if (!shouldCheck) {
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        const { data }: AxiosResponse<ApiResponse<{ accessToken: string; user: PatientUser }>> =
          await api.post('/pazienti/auth/refreshToken');

        const { accessToken, user } = data.data;
        setAccessToken(accessToken);
        setUser(user);
      } catch {
        console.log("❌ Nessun refresh valido, utente non loggato");
        handleForceLogout(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [location.pathname]);

  // --- Verifica email ---
  const checkEmail = async (email: string) => {
    const res = await api.post('/pazienti/auth/check-email', { email });
    return res.data
  };

  // --- Login ---
  const login = async (email: string, password: string) => {
    try {
      const { data }: AxiosResponse<ApiResponse<{ accessToken: string; user: PatientUser }>> =
        await api.post('/pazienti/auth/login', { email, password });
      const { accessToken, user } = data.data;

      setAccessToken(accessToken);
      setUser(user);
      navigate('/app/welcome');
    } catch (error) {
      throw error;
    }
  };

  // --- Registrazione completa ---
  const registerComplete = async (email: string, password: string) => {
    try {
      await api.post('/pazienti/auth/register', { email, password });
      await login(email, password); // login automatico
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Errore durante la registrazione.");
      }
      throw new Error("Errore di rete o del server.");
    }
  };

  // --- Logout ---
  const logout = async () => {
    try {
      await api.post('/pazienti/auth/logout');
    } catch (err) {
      console.warn('Logout server fallito:', err);
    } finally {
      handleForceLogout();
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, checkEmail, registerComplete, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook personalizzato
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve essere usato dentro un AuthProvider');
  return context;
};
