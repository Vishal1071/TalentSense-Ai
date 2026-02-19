import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from "./components/commn/ProtectedRoute.jsx"


import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

import Dashboard from './pages/Dashboard.jsx'
import Userlayout from './components/layout/Userlayout.jsx'
import UploadResume from './pages/UploadResume.jsx'
import MockInterview from './pages/MockInterview.jsx'
import JobMatch from './pages/JobMatch.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />

            <Route path='/' element={<ProtectedRoute> <Userlayout /> </ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path='/upload-resume' element={<UploadResume />} />
            <Route path='/mock-interview' element={<MockInterview />} />
            <Route path='/jobMatch' element={<JobMatch />} />
            </Route>
              
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
