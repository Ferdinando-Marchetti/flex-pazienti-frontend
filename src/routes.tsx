import { createBrowserRouter, Navigate } from "react-router-dom"

import App from "./App"
import AppLayout from "./pages/app/AppLayout"
import DashboardPage from "./pages/app/DashboardPage"
import ChatPage from "./pages/app/Chat"
import LoginPage from "./pages/Login"

export const router = createBrowserRouter([
  { path: '', element: <App />, children:[
    { index: true, element: <Navigate to="/login" replace /> },
    { path: '/login', element: <LoginPage /> },
    { path: "/app", children:[
      { path: '', element: <AppLayout />, children:[
        { index: true, element: <Navigate to="dashboard" replace /> },
        { path: "dashboard", element: <DashboardPage /> },
        { path: "chat", element: <ChatPage /> },
      ]}
    ]}
  ]},
])