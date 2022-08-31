import React ,{useContext,useState,useEffect} from "react"
import "../Navbar.css"
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () =>{
    let {user , logoutUser} = useContext(AuthContext);
    
    return (
        <div className="topnav">
                <Link to="/users">Users</Link>
                <Link to="/projects">Projects</Link>
                <Link to="/tasks">Tasks</Link>
                { !user ? (<Link to="/login">Login</Link>) : (<Link to=""  onClick={logoutUser}>Logout</Link>)}   
                {user && <a style={{float:'right', color:"white"}}>Hello {user.FirstName + " " + user.LastName}</a>}
        </div> 
    );
}

export default Navbar;