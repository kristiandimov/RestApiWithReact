import {useState} from 'react'
import React from 'react'
import { Modal,Form,Button } from 'react-bootstrap'

const CreateUser = (props) =>{

    const handleSumbit = async e =>{
        e.preventDefault();

            const user = {
                'id':props.data.id ? props.data.id : null,
                'username':username,
                'FirstName':firstName,
                'lastName':lastName,
                'password':password
            }

            if(user.id){
                props.update(user);
                props.clearData();
            }else{
                props.create(user);
            }
        }


    const [username,setUsername] = useState('');
    const [firstName,setFirstName] = useState('');
    const [lastName,setLastName] = useState('');
    const [password,setPassword] = useState('');

    return(
        <Modal show={props.show} centered>
            <Modal.Header>
                <Modal.Title>
                    <>{props.data.id ? "Update" : "Create"}</>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSumbit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder='Kris123' 
                            autoFocus
                            defaultValue = {props.data.username ? props.data.username : null}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder='Kristian' 
                            autoFocus
                            defaultValue = {props.data.firstName ? props.data.firstName : null}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder='Dimov' 
                            autoFocus
                            defaultValue = {props.data.lastName ? props.data.lastName : null}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder='Kris123' 
                            autoFocus
                            defaultValue = {props.data.password ? props.data.password : null}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <div className ="btn-toolbar" style={{ display: "flex", justifyContent: "end" }}>
                        <Button  
                            className="btn-group me-1" 
                            variant="secondary" 
                            onClick={ () => 
                            {
                                props.close();
                                props.clearData();
                            }}
                        >Close</Button>
                        <Button  
                            className="btn-group me-1" 
                            variant="primary" 
                            type="submit" 
                            onClick={ () => {
                                props.close();
                            }}><>{props.data.id ? "Update" : "Create"}</></Button>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateUser;