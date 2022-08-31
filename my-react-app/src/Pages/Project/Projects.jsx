import React,{useState,useEffect,useContext} from "react";
import AuthContext from "../../context/AuthContext";
import useAxios from "../../utils/useAxios";
import CustomMaterialTable from "../../utils/CustomMaterialTable";


const Projects = (props) => {
    let [projects,setProjects] = useState([]);
    const {tokens, logoutUser} = useContext(AuthContext);
    let [owners,setOwners] = useState({});
    
    const columns = [
        {field: "id",title: 'ID',hidden: true},
        {field: "title",title: 'Title',validate:rowData => {
            if(rowData.title === undefined || rowData.title === ''){
                return "Required"
            }
        }},
        {field: "description",title: 'Description',validate:rowData => {
            if(rowData.description === undefined || rowData.description === ''){
                return "Required"
            }
        }},
        {title: "Owner",field: "ownerId",lookup: owners,validate:rowData => {
            if(rowData.ownerId === undefined || rowData.ownerId === ''){
                return "Required"
            }
        }}]
    
    let api = useAxios();
    
    const getProjects = async () =>{
        try{
            let responseProjects = await api.get('/api/Projects').then(res => {
                setProjects(res.data.data)
            })
        } catch (err){
            console.log(err)
        }
    }

    const getUsers = async() => {
        let responseUsers = await api.get('/api/Users').then(users => {
            const owners = {}

            users.data.data.map(row => owners[row.id] = row.username)
            setOwners(owners)

        })
    }

    const createProjects = async (data) =>{
        data.ownerId = Number(data.ownerId)
        let response = await api.put('/api/Projects',data)
  
        setProjects(current =>  [...current,response.data.data]);
    }
    
    const updateProjects = async (data) =>{
        data.ownerId = Number(data.ownerId)
        let response = await api.post('/api/Projects',data)

        setProjects(projects.filter(x => x.id !== data.id));
        setProjects(current =>  [...current,response.data.data]);
    }
    
    const deleteProjects = async (id) =>{
        let response = await api.delete('/api/Projects?id='+id).then(res =>{
            setProjects(projects.filter(x => x.id !== id));
        })
        .catch(error => {
            alert("You can't delete this project due to attached Task");
        });
    }

    useEffect(() => {
        getProjects();
        getUsers();
    },[]);
    


    return(
        <div style={{ height: 700, width: '100%' }}>
            <CustomMaterialTable
                title="Projects"
                columns={columns}
                data={projects}
                create={createProjects}
                update={updateProjects}
                delete={deleteProjects}
            />
        </div>
    );
}

export default Projects;
