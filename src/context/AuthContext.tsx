import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios, { type AxiosResponse } from 'axios';

// URL di base dell'API (Assicurati che sia quello corretto per il tuo backend)
const API_URL = import.meta.env.VITE_API_URL || "https://84dcg7p1-1337.euw.devtunnels.ms/";

// Interfaccia che riflette i campi del pazienti (al netto della password)
interface PatientUser {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  data_nascita: string; // La data sarà una stringa ISO o simile
  genere: 'M' | 'F' | 'Altro';
  altezza: number | null; // Usiamo number | null per Altezza e Peso
  peso: number | null;
  diagnosi: string | null;
}

// Interfaccia per la risposta dei dati (per coerenza con il backend)
interface ApiResponse<T> {
    data: T;
}

interface AuthContextType {
  user: PatientUser | null;
  login: (email: string, password: string) => Promise<void>;
  // ✅ FUNZIONE AGGIUNTA PER LA FASE 1
  registerCheckEmail: (email: string) => Promise<void>; 
  // ✅ FUNZIONE PER LA FASE 2
  registerComplete: (
    nome: string,
    cognome: string,
    data_nascita: string,
    genere: 'M' | 'F' | 'Altro',
    altezza: number | null,
    peso: number | null,
    diagnosi: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Axios instance configurata
export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Importante per i refresh token basati su cookie
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<PatientUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Rotte da escludere dal check iniziale di autenticazione
  const ExcludeCheck = [
    { href: "/auth/login"},
    { href: "/auth/register"},
  ];

  const currentPage =
    ExcludeCheck.find(
      (Ex) =>
        location.pathname === Ex.href ||
        location.pathname.startsWith(`${Ex.href}/`)
    )?.href || "";

  // --- Funzione di logout forzato centralizzata ---
  const handleForceLogout = (redirect = true) => {
    setUser(null);
    setAccessToken(null);
    if (redirect) {
      navigate('/auth/login', { replace: true }); 
    }
  };

  // --- INTERCEPTOR RISPOSTE ---
  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if(error.response?.status === 503){
          navigate('/maintenance');
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const { data }: AxiosResponse<ApiResponse<{ accessToken: string; user: PatientUser }>> = await api.post('/pazienti/auth/refresh');
            const { accessToken: newAccessToken, user } = data.data;

            setAccessToken(newAccessToken);
            setUser(user);

            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            console.warn('❌ Refresh fallito, logout forzato');
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

  // --- INTERCEPTOR RICHIESTE (autorizzazione) ---
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


  // --- Funzioni di Autenticazione ---

  const checkUserStatus = async () => {
    try {
      setIsLoading(true);
      const { data }: AxiosResponse<ApiResponse<{ accessToken: string; user: PatientUser }>> = await api.post('/pazienti/auth/checkRefresh');
      const { accessToken: newAccessToken, user } = data.data;

      setAccessToken(newAccessToken);
      setUser(user);
    } catch {
      handleForceLogout(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if(location.pathname !== currentPage){
      checkUserStatus();
    } else {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]); 

  // ✅ IMPLEMENTAZIONE FASE 1: Verifica Email
  const registerCheckEmail = async (email: string) => {
      // Nota: usiamo GET/POST con parametri nell'URL come da implementazione del controller
      try {
          // Endpoint: /pazienti/auth/register/test@email.com
          const url = `/pazienti/auth/check-register`; 
          await api.post(url,{email}); 
      } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
              // Estraiamo il messaggio d'errore dal backend (es. "Email non trovata" o "Già registrato")
              return Promise.reject(error.response.data.message || "Errore durante la verifica dell'email.");
          }
          return Promise.reject("Errore di rete o del server.");
      }
  };


  const login = async (email: string, password: string) => {
    await api.post('/pazienti/auth/login', { email, password });
    await checkUserStatus();
    navigate('/app/dashboard'); 
  };

  // ✅ IMPLEMENTAZIONE FASE 2: Registrazione Completa
  const registerComplete = async (
    nome: string,
    cognome: string,
    data_nascita: string,
    genere: 'M' | 'F' | 'Altro',
    altezza: number | null,
    peso: number | null,
    diagnosi: string,
    email: string,
    password: string,
  ) => {
    try {
      await api.post('/pazienti/auth/register', {
        nome,
        cognome,
        data_nascita,
        genere,
        altezza,
        peso,
        diagnosi,
        email,
        password,
      });
      // Login automatico dopo la registrazione
      await login(email, password);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
            return Promise.reject(error.response.data.message || "Errore durante il completamento della registrazione.");
        }
        return Promise.reject("Errore di rete o del server.");
    }
  };

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
    <AuthContext.Provider value={{ user, login, registerCheckEmail, registerComplete, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve essere usato dentro un AuthProvider');
  return context;
};