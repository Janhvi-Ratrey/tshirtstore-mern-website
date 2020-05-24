import React, {useState, useEffect} from 'react';
import Base from "../core/Base";
import { isAuthenticated } from '../auth/helper';
import {getCategory, updateCategory} from "./helper/adminapicall";
import {Link} from 'react-router-dom';

const UpdateCategory = ({match}) => {
   // const [name, setName] = useState("")
   // const [error, setError] = useState(false)
   // const [success, setSuccess] = useState(false)
    const {user, token} = isAuthenticated();


    const [values, setValues] = useState({
        name: "",
        error:"",
        createdCategory: "",
        success: "",
        category: "",
        formData: "" 
        
    });

    const {name, error, createdCategory, success, category, formData} = values;

    const handleChange= event =>{
       
        // formData.set(name , event.target.value)
        // console.log(formData);
        
        setValues({...values, name: event.target.value})
       
      }
    
const onSubmit = event => {
    event.preventDefault();
    setValues({...values, error: ""})
    console.log(name);
    
    updateCategory(match.params.categoryId, user._id, token, {name}).then(data => {
      if(data.error){
        setValues({...values, error: data.error})
        console.log(data.error);
        
      }
      else{
        setValues(
          {
            ...values,
            name: "",
            createdCategory: data.name
          }
        )
      }
    })
}

const preload = (categoryId) => (
    getCategory(categoryId).then(data => {
        console.log(data);
        
        if(data.error){
          setValues({...values, error: data.error})
        }
        else{
           setValues({...values, name:data.name, category: data.categoryId, formData: new FormData()})
        }
    })
)

useEffect(() => {
    preload(match.params.categoryId);
  }, []);

    const myCategoryForm =() => (
        <form>
        
          <div className="form-group">
            <p className="lead">Update Category</p>
            <input 
            type="text"
            name="name"
            className="form-control my-3"
            onChange ={handleChange}
            value={name}
            autoFocus
            required
           // placeholder="eg. Summer"
            />
            <button onClick = {onSubmit} className="btn btn-outline-info">Update Category</button>

          </div>
        
        </form>
    )

    const successMessage = () => {
        return(
            <div className="alert alert-success mt-3"
            style = {{display: createdCategory? "": "none"}}
            >
              <h4>{createdCategory} updated succesfully</h4>
            </div>
          )
    }
    const warningMessage =() => {
        if(error!="") {
            return (
              <div className="alert alert-success mt-3">
              <h4>Failed to update category</h4>
              </div>
            )
        }
      }
    
    return(
        <Base title="Update Category" description= "update your categories here"
        className="container bg-info p-4">
       <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">Admin Home</Link>
       <div className="row bg-dark text-white rounded">
         <div className ="col-md-8 offset-md-2">
            {successMessage()}
            {warningMessage()}
            {myCategoryForm()}
         </div>
       </div>


        </Base>
    )


    }
export default UpdateCategory;