const User = require("../models/user");
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
const { check, validationResult } = require('express-validator');

exports.signup = (req,res)=>{
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
           field: errors.array()[0].param,
           error: errors.array()[0].msg
            
        });
    }



     const user = new User(req.body);
     user.save((err , user)=>{
         if(err){
             return res.status(400).json({
                 err: "NOT able to add the user"
             });
         }
         res.json({
             name: user.name,
             email:user.email,
             id: user._id
         })
     })


};

exports.signin = (req,res) =>{
  //checking if user has a valid email and password
    const {email,password} = req.body;
   const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
           field: errors.array()[0].param,
           error: errors.array()[0].msg
            
        });
    }

   //checking if email exists in the database
    User.findOne({email} , (err,user)=>{
        //if email does not exist
        if(err || !user){
            return res.status(400).json({
                error: "email does not exist"
            });
        }
        //if the email and password do not match with what we have in database
        if(!user.authenticate(password)){
          return  res.status(401).json({
                error: "email and password do not match"
            })
        }

      //if everything is good, CREATE A JWT TOKEN
      const token = jwt.sign({_id: user._id}, process.env.SECRET);

      //PUT TOKEN IN USER'S COOKIE (BROWSER COOKIE)
      res.cookie("token" , token , {expire: new Date() +9999});

      //SEND RESPONSE TO FRONTEND 
      const {_id , name , email, role} = user;
      return res.json({
          token, 
          user: {_id , name, email, role}});
     });
};

exports.signout =  (req, res) =>{

      res.clearCookie("token");

    // res.send("User Signout");  sending json instead of text
     res.json({
         message: "User Signed out Successfully"
     });
 };

 //PROTECTED ROUTES

exports.isSignedIn = expressJwt({      //next is covered up by exressjwt in this middleware
    secret: process.env.SECRET,
    userProperty: "auth"
})


 //CUSTOM MALWARE
exports.isAuthenticated = (req , res, next) => {

    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
      return  res.status(403).json({
          error: "ACCESS DENIED!"
        });
    }
next();
}
 

exports.isAdmin = (req , res, next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            error: "NOT AN ADMIN"
        })
    }

next();    
}