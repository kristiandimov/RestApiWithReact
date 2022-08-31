import jwtDecode from "jwt-decode";
import axios from "axios";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";


const baseURL = 'http://localhost:8230';


const useAxios = () => {

    const {tokens,setUser,setTokens,logoutUser} = useContext(AuthContext);

    const axiosInstance = axios.create({
        baseURL,
        headers:{Authorization:`Bearer  ${tokens?.accessToken}`}
    });

    axiosInstance.interceptors.request.use(async req => {

        const user = jwtDecode(tokens.accessToken);
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1
    
        if(!isExpired) return req;
    
        const response = await axios.post(`${baseURL}/api/Token/RefreshToken`,{
            RefreshToken: tokens.refreshToken
        }).then(res => {
            localStorage.setItem('tokens',JSON.stringify(res.data));
            setTokens(res.data)
            setUser(jwtDecode(res.data.accessToken))
            req.headers.Authorization = `Bearer  ${res.data.accessToken}`
        })
        .catch(error => {
            console.log(error);
            logoutUser();
        });
        
        return req
    
    });
    

    return axiosInstance
}

export default useAxios;