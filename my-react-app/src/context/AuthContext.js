import { createContext, useState, useEffect } from 'react'
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router';

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {
    let [tokens,setTokens] = useState(localStorage.getItem("tokens") ? JSON.parse(localStorage.getItem("tokens")) : null); 
    let [user,setUser] = useState(localStorage.getItem("tokens") ? jwt_decode(localStorage.getItem("tokens")) : null);
    let [usersContext,setUsersContext] = useState([]);
    let [loading, setLoading] = useState(true);
    let navigate = useNavigate();

    const loginUser = async (event) => {
        event.preventDefault();
        let response = await fetch('http://localhost:8230/api/Token/Login', {
            method:'PUT',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'username':event.target.username.value, 'password':event.target.password.value})
        })

        let data = await response.json();

        if(response.status === 200){
            setTokens(data);
            setUser(jwt_decode(data.accessToken));
            localStorage.setItem('tokens',JSON.stringify(data));
            navigate("/");
        }else{
            alert("Wrong username or password");
        }

    };

    const logout = async () => {

        let response = await fetch('http://localhost:8230/api/Token/Logout', {
            method:'DELETE',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'RefreshToken':tokens.refreshToken})
        })
    }

    const logoutUser = () => {
        logout();
        setTokens(null);
        setUsersContext(null);
        setUser(null);
        localStorage.removeItem('tokens');
        navigate("/");
        alert("Succesful logout");
    }

    let contextData = {
        user:user,
        setUser:setUser,
        usersContext:usersContext,
        setUsersContext:setUsersContext,
        tokens:tokens,
        setTokens:setTokens,
        loginUser:loginUser,
        logoutUser:logoutUser
    }

    useEffect(()=> {
        
        if(tokens){
            setUser(jwt_decode(tokens.accessToken));
        }

        setLoading(false);

    }, [tokens,loading])

        return(
            <AuthContext.Provider value={contextData}>
                {loading ? null : children}
            </AuthContext.Provider>
        )
}