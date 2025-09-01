import { useEffect, useState } from "react"

export default function Todo() {

      const [title, setTitle] = useState("");
      const [description, setDescription] = useState("");
      const[todos, setTodos] = useState([]);
      const[error, setError] = useState("");
      const[message, setMessage] = useState("");
      const[editeId, setEditId] = useState(-1);

      //Edit
      const [edittitle, setEditTitle] = useState("");
      const [editdescription, setEditDescription] = useState("");


      const apiUrl = "http://localhost:8000"

    const handleSubmit=()=>{
        setError("")
      //check inputs 
      if (title.trim() !=='' && description.trim() !== '') {

       fetch(apiUrl+ "/todos", {

        method: "POST",
        headers: {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({title,description})
       }).then((res)=>{
        if (res.ok) {
        //add item to list
        setTodos([...todos,{title, description} ])
        setMessage("Item added successfully")
         setTitle("");
         setDescription("");
        setTimeout(()=>{
          setMessage("");

        },3000)

        }else {
            //error
            setError("Unable to create Todo item")
        }
      

       }).catch(()=>{

        setError("Unable to create Todo item")

       })

        
      }
    }
   
useEffect(()=>{
   getItems()

}, [])

    const getItems = ()=>{
        fetch(apiUrl + "/todos")
        .then((res) => res.json() )
        .then((res) =>{
          setTodos(res)
        })
    }

    const handleEdit  = (item) =>{ 
        setEditId(item._id); 
        setEditTitle(item.title); 
        setEditDescription(item.description)
    }
     
    const handleUpdate = () =>{
         setError("")
      //check inputs 
      if (edittitle.trim() !=='' && editdescription.trim() !== '') {

       fetch(apiUrl+ "/todos/"+ editeId, {

        method: "PUT",
        headers: {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({title : edittitle,description : editdescription})
       }).then((res)=>{
        if (res.ok) {
        //update item to list
        const updatedTodos = todos.map((item)=>{
        if (item._id == editeId) {
             item.title = edittitle;
             item.description = editdescription;
            
        }
         return item;
        })

        setTodos(updatedTodos)
        setMessage("Item Updated successfully")
        setEditTitle("");
         setEditDescription("");
        setTimeout(()=>{
          setMessage("");

        },3000)

        setEditId(-1)

        }else {
            //error
            setError("Unable to create Todo item")
        }
      

       }).catch(()=>{

        setError("Unable to create Todo item")

       })

        
      }
    

    }

    const handleEditCancel = () =>{
        setEditId(-1)

    }

    const handleDelete = (id) =>{
        if (window.confirm("Are you sure want to delete?")) {
            fetch(apiUrl+'/todos/'+id,{
                method: "DELETE"
            })
            .then(() =>{
               const updatedTodos = todos.filter((item) =>item._id !== id)
               setTodos(updatedTodos)
            })
        }

    }

    return <>
   
    <div className="row p-2 text-center bg-success text-light">

        <h1>Todo Project With MERN Stack</h1>

    </div >

    <div className="row">
     <h3>Add Item</h3>
     {message && <p className="text-success">{message}</p> }

       <div className="form-group d-flex gap-3">
          <input  placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={title}  className="form-control " type="text" />
          <input  placeholder="Description" onChange={(e) => setDescription(e.target.value)} value={description} className="form-control " type="text" />
          <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
       </div>
         {error && <p className="text-danger">{error}</p>}
    </div>
       

       <div className="row mt-3">
         <h3>Task</h3> 

         <div className="col-md-6 ">
            <ul className="list.group">

            {
               todos.map((item)=>
                 <li className="list-group-item d-flex justify-content-between bg-light  align-items-center my-2">
                 <div className="d-flex flex-column me-2">
                    {
                        editeId == -1 || editeId !== item._id?  <>

                         <span className="fw-bold">{item.title}</span>
                         <span>{item.description}</span>
                        </> : <>
                           <div className="form-group d-flex gap-3">
                                 <input  placeholder="Title" onChange={(e) => setEditTitle(e.target.value)} value={edittitle}  className="form-control " type="text" />
                                 <input  placeholder="Description" onChange={(e) => setEditDescription(e.target.value)} value={editdescription} className="form-control " type="text" />
           
                           </div>
                        </>
                    }
                   
                  </div>
                
                   <div className="d-flex gap-2">
                   {   editeId == -1 || editeId !== item._id? <button className="btn btn-warning" onClick={ () =>handleEdit(item)}>Edit</button> :<button onClick={(handleUpdate)}>Update</button>}
                    {   editeId == -1 ?<button className="btn btn-danger" onClick={() =>handleDelete(item._id)}> Delete</button> : 
                    <button className="btn btn-danger" onClick={handleEditCancel}> Cancel</button> }
                   </div>
                
                </li>


            ) 
            }
             
                
         </ul>
            </div>
       </div>

     </>
}