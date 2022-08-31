import React,{useState,useContext} from "react";
import AuthContext from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Form,Button } from "react-bootstrap";
import '../styles/Login.css'


const Login = () => {
    const {loginUser,user} = useContext(AuthContext);
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');

    const validateForm = () => {
        return username.length > 0 && password.length > 0;
    }

    if(user){
        return <Navigate to="/"></Navigate>
    }

    return(
    <div className="Login">
        <Form onSubmit={loginUser}>
            <Form.Group size="lg" controlId="email">
            <Form.Label>Username</Form.Label>
            <Form.Control
                name="username"
                autoFocus
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            </Form.Group>
            <Form.Group size="lg" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </Form.Group>
            <Button block="true" size="lg" type="submit" disabled={!validateForm()}>
            Login
            </Button>
        </Form>
    </div>
    // <form onSubmit={loginUser}>
    //     <h1>Please sign in</h1>
    //         <input type="text" name="username" placeholder="Enter Username"></input>
    //         <br/>
    //         <input type="password" name="password" placeholder="Enter Password"></input>
    //         <br/>
    //         <input type="submit" value="Login"></input>
    // </form>
    //implemetn the Logout Submit here if login is succesfull
    );
}

export default Login;