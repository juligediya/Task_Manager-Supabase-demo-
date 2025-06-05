import { useAuth } from './contexts/AuthProvider'
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
    const {user}=useAuth();
    if(user)
        return <Outlet/>
    else
        return <Navigate to="/login" replace/>
 
}

export default ProtectedRoute