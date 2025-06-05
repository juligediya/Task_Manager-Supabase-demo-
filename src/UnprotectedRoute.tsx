import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./contexts/AuthProvider";

function UnprotectedRoute() {
     const {user}=useAuth();
    if(!user)
        return <Outlet/>
    else
        return <Navigate to="/" replace/>
}

export default UnprotectedRoute