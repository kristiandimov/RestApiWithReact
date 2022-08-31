import { Navigate } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import { useContext } from "react"

const ProtectedRoute = ({children}) => {
    //if user is null havigate to login
    const {user} = useContext(AuthContext);
    
    if(!user){
        return <Navigate to="/Login"></Navigate>
    }
    
    return children;
}

export default ProtectedRoute;