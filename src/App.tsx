
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './contexts/AuthProvider'
import { LoginPage } from './Login'
import Tasks from './Task'
import { SignupPage } from './SignUp'
import UnprotectedRoute from './UnprotectedRoute'
import ProtectedRoute from './ProtectedRoute'
import AuthCallback from './AuthCallback'

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route element={<UnprotectedRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/auth/v1/callback" element={<AuthCallback />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Tasks />} />
          </Route>
        </Routes>


      </AuthProvider>
      {/* <Tasks/> */}
    </>
  )
}

export default App
