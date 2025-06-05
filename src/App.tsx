
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './contexts/AuthProvider'
import { LoginPage } from './Login'
import Tasks from './Task'


function App() {


  return (
    <>
    <AuthProvider>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Tasks />} />
      </Routes>


    </AuthProvider>
     {/* <Tasks/> */}
    </>
  )
}

export default App
