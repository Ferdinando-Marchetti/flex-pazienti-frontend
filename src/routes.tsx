import { createBrowserRouter, Navigate } from "react-router-dom"

import App from "./App"
import AppLayout from "./pages/AppLayout"

export const router = createBrowserRouter([
  { path: '', element: <App />, children:[
    { index: true, element: <Navigate to="/" replace /> },
    
    { path: "/app", children:[
      { path: '', element: <AppLayout />, children:[
        { index: true, element: <Navigate to="dashboard" replace /> },
        { path: "dashboard", element: <h1>Welcome Dashboard</h1> },
        { path: "pazienti", element: <h1>Welcome Pazienti</h1> },
      ]}
    ]}
  ]},
])