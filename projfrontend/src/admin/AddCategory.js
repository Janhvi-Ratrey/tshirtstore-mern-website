import React, { useState } from 'react';
import Base from '../core/Base';
import { isAuthenticated } from '../auth/helper';
import { Link } from 'react-router-dom';
import { createCategory } from './helper/adminapicall';





const AddCategory = () => {
      const [name, setName] = useState("")
      const [error, setError] = useState(false)
      const [success, setSuccess] = useState(false)

      const {user, token} = isAuthenticated();

     const goBack = () =>(
         <div className="mt-5">
           <Link className="btn btn-sm btn-success mb-3" to="/admin/dashboard">
             Admin Home
           </Link>
         </div>
     )


     const handleChange= event => {
         setError("");
         setName(event.target.value)
         setSuccess(false)
        
        }

     const onSubmit = (event) => {
         event.preventDefault()
         setError("")
         setSuccess(false)

          //backend request fired
          createCategory(user._id, token, {name})
          .then(data => {
              if(data.error){
                  setError(true)
              }
              else{
                  setError("");
                  setSuccess(true)
                  setName("")
              }
          })

     }

     const successMessage = () => {
         if(success) {
             return <h4 className="text-success">Category created succesfully</h4>
         }
     }

     const warningMessage =() => {
        if(error) {
            return <h4 className="text-success">Failed to create category</h4>
        }
     }

      const myCategoryForm =() => (
          <form>
          
            <div className="form-group">
              <p className="lead">Enter a category</p>
              <input 
              type="text"
              className="form-control my-3"
              onChange ={handleChange}
              value={name}
              autoFocus
              required
              placeholder="eg. Summer"
              />
              <button onClick = {onSubmit} className="btn btn-outline-info">Create Category</button>

            </div>
          
          </form>
      )






   return (
       <Base title="Create Category" 
       description= "Add a new category for your collection"
       className="container bg-info p-3">
       
       <div className="row bg-white rounded">
        <div className="col-md-8 offset-md-2">
        {successMessage()}
        {warningMessage()}
        {myCategoryForm()}
        {goBack()}
        </div>
       </div>
       </Base>
   )
}

export default AddCategory;