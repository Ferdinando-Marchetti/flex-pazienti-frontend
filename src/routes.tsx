import { createBrowserRouter, Navigate } from "react-router-dom"

import App from "./App"
import AppLayout from "./pages/app/AppLayout"
import DashboardPage from "./pages/app/DashboardPage"
import ChatPage from "./pages/app/Chat"
import LoginPage from "./pages/auth/Login"
import SchedeAllenamentoPage from "./pages/app/Allenamento/SchedeAllenamento"
import AppuntamentiPage from "./pages/app/Appuntamenti"
import DettagliSchedaPage from "./pages/app/Allenamento/DettagliScheda"
import RiepilogoSessionePage from "./pages/app/sessioni/RiepilogoSessionePage"
import NuovaSessione from "./pages/app/sessioni/NuovaSessione"

export const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: "login", element: <LoginPage /> },
      {
        path: "app",
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <DashboardPage /> },
          { path: "appuntamenti", element: <AppuntamentiPage />},
          { path: "chat", element: <ChatPage /> },
          { path: "allenamento", element: <SchedeAllenamentoPage /> },
          { path: "allenamento/:id", element: <DettagliSchedaPage /> },
          { path: "sessioni/:id", element: <NuovaSessione /> },
          { path: "sessione/:id", element: <RiepilogoSessionePage /> },
          { path: "chat/:trattamento_id", element: <ChatPage /> },
        ],
      },
    ],
  },
  { path: '*', element: 
    <>
      <h1>Pagina non trovata...</h1>
    </>
  }
])
