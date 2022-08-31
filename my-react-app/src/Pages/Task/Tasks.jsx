import React,{useState,useEffect,useContext} from "react";
import AuthContext from "../../context/AuthContext";
import useAxios from "../../utils/useAxios";
import MaterialTable from "@material-table/core";
import CustomMaterialTable from "../../utils/CustomMaterialTable";



const Task = (props) => {
    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    );

    let [tasks,setTasks] = useState([]);
    const {projects, setProjects} = useContext(AuthContext);
    let [usersOwners,setUsersOwners] = useState({});
    let [projectsOwners,setProjectsOwners] = useState({});
    //let [owners,setOwners] = useState({});
    
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
        {field: "storyPoints",title: "StoryPoints",type:'numeric', validate:rowData => {
            if(rowData.storyPoints === undefined){
                return "Required"
            }else if(rowData.storyPoints <= 0){
                return "Invalid value"
            }
        }},
        {field: "createdTime",title: "CreatedTime",editable: 'never'},
        {field: "updatedTime",title: "UpdatedTime",editable: 'never'},
        {field: "projectId",title: "ProjectId",lookup: projectsOwners,validate:rowData => {
            if(rowData.projectId === undefined || rowData.projectId === ''){
                return "Required"
            }
        }},
        {field: "userId",title: "UserId",lookup: usersOwners,validate:rowData => {
            if(rowData.userId === undefined || rowData.userId === ''){
                return "Required"
            }
        }}
    ]
    
    let api = useAxios();
    
    const getTask = async () =>{
        try{
            let responseTasks = await api.get('/api/Tasks').then( res => {
                setTasks(res.data.data);
            })
        } catch (err){
            console.log(err);
        }
        
        
    }

    const getProjects = async() => {
        let responseProjects = await api.get('/api/Projects').then(projects => {
            const ownersProject = {}

            projects.data.data.map(row => ownersProject[row.id] = row.title)
            setProjectsOwners(ownersProject)

        })
    }

    const getUsers = async() => {
        let responseUsers = await api.get('/api/Users').then(users => {
            const ownersUsers = {}

            users.data.data.map(row => ownersUsers[row.id] = row.username)
            setUsersOwners(ownersUsers)

        })
    }

    const createTask = async (data) =>{
        data.projectId = Number(data.projectId)
        data.userId = Number(data.userId)
        let response = await api.put('/api/Tasks',data)

        setTasks(current =>  [...current,response.data.data]);
    }
    

    const updateTask = async (data) =>{
        data.projectId = Number(data.projectId)
        data.userId = Number(data.userId)
        let response = await api.post('/api/Tasks',data)

        setTasks(tasks.filter(x => x.id !== data.id));
        setTasks(current =>  [...current,response.data.data]);
    }
    
    const deleteTask = async (id) =>{
        let response = await api.delete('/api/Tasks?id='+id).then(res => {
            setTasks(tasks.filter(x => x.id !== id));
        })
        .catch(error => {
            alert("You can't delete this project due to attached Task");
        });
    }

    useEffect(() => {
        getTask();
        getProjects();
        getUsers();
    },[]);
    


    return(
        <div style={{ height: 700, width: '100%' }}>
            <CustomMaterialTable 
                title="Tasks" 
                columns={columns}
                data={tasks} 
                create={createTask} 
                update={updateTask} 
                delete={deleteTask}>
            </CustomMaterialTable>
        </div>
    );
}

export default Task;
