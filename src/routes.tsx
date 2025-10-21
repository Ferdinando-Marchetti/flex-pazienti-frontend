import { createBrowserRouter, Navigate } from "react-router-dom"

import App from "./App"
import AppLayout from "./pages/AppLayout"
import DashboardPage from "./pages/DashboardPage"
import ChatPage from "./pages/Chat"

export const router = createBrowserRouter([
  { path: '', element: <App />, children:[
    { index: true, element: <Navigate to="/" replace /> },
    
    { path: "/app", children:[
      { path: '', element: <AppLayout />, children:[
        { index: true, element: <Navigate to="dashboard" replace /> },
        { path: "dashboard", element: <DashboardPage /> },
        { path: "chat", element: <ChatPage /> },
      ]}
    ]}
  ]},
])