import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from "./components/commn/ProtectedRoute.jsx"

import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

import Dashboard from './pages/Dashboard.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />

            <Route path='/' element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
              />
              
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
