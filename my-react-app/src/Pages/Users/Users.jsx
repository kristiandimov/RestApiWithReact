import React,{useEffect, useState,useContext} from "react";
import AuthContext from "../../context/AuthContext";
import useAxios from "../../utils/useAxios";
import { Button } from "react-bootstrap";
import CreateUser from "./CreateUpdateUser";
import Table from "react-bootstrap/Table";

let reqUri = '/api/Users';

const Users = () => {
    let [users, setUsers] = useState([])
    let {usersContext, setUsersContext} = useContext(AuthContext)
    let [show,setShow] = useState(false);
    let [user,setUser] = useState({});
    let [filtered,setFiltered] = useState([]);
    
    let api = useAxios();
    //Opeingn the Modal and on every call changes the state value to true/false defaut value on opeining the page is false
    const openModal = () =>
    {
        setShow(!show);
    }

    //Helps to pass the data to the modal first filters the current data table 
    //and find the the record by key id then we save it to the state user and we pass it to the modal for the update sequence
    const passData = (id) =>{
        let data = users.find(x => x.id === id);
        setUser(data);
    }

    //This func helps us to clear the user state if 
    const clearModal = () =>{
        setUser({});
    }

    const searchUsers = (username) =>{
        if(username === ''){
            setFiltered([]);
        }else{
            setFiltered(users.filter(u => u.username === username))
        }
    }

    //GetUsers
    const getUsers = async () => {

        let response = await api.get(reqUri)
        setUsersContext(await response.data.data)
        if(response.status === 200){
            setUsers(response.data.data)
        }
    }
    
    //DeleteUsers
    const deleteUser = async (id) =>{
        const url = '/api/Users?id='+ id;
        const response = await api.delete(url)
        .then(response => {
            setUsers(users.filter(x => x.id !== id));
        })
        .catch(error => {
            alert(error.response.data.detail);
        });
        
    }
    
    //CreateUsers
    const createUser = async (data) =>{
        let response = await api.put("/api/Users",data);

        //adding new created record to the user state array
        setUsers(current =>  [...current,response.data.data]);
        
    }

    //UpdateUsers
    const updateUser = async (data) =>{
        let response = await api.post("/api/Users",data);

        //adding the new updated record to the users state array
        setUsers(current =>  [...current,response.data.data]);

    }

    //Fills the table when we enter the page every time and its triggered on refresh
    useEffect(() => {
        getUsers();
    },[]);


    return(
        <div className="container">
            <div className="row">
                <div className="col">
                    <h1 className="mt-4">List of Users</h1>
                        <>
                            <div className="float-end">
                                <Button className="btn-group btn-lg mb-5" onClick={openModal}>Create</Button>
                            </div>
                            <CreateUser show={show} close={openModal} create={createUser} update={updateUser} data={user} clearData={clearModal}></CreateUser>
                        </>             
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-4">
                    <input type="text" className="form-control" placeholder="Search by username" onChange={(e) => searchUsers(e.target.value)}></input>
                </div>
            </div>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                    <th>Operations</th>
                </tr>
            </thead>
            <tbody>
            <>
                {(filtered.length > 0 ? filtered : users).map((user) => (
                    <tr key={user.id}>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.username}</td>
                        <td>
                            <Button 
                                className="btn-group me-1" 
                                onClick={() => {
                                    passData(user.id);
                                    openModal();
                            }}>Edit</Button>

                            <Button 
                                className="btn-group me-1"
                                variant="danger" 
                                onClick={() => deleteUser(user.id)
                            }>Delete</Button>
                        </td>
                    </tr>
                ))}                  
            </>
            </tbody>
      </Table>
      </div>
    );
}

export default Users;