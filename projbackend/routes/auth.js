var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");


router.post("/signup" ,[
      check("name").isLength({ min:3 }).withMessage("must be at least 3 characters long"),
      check("email").isEmail().withMessage("a valid email is required"),
      check("password").isLength({min:8}).withMessage("must be at least 8 characters long")
], signup);


router.post("/signin" ,[
    check("email").isEmail().withMessage("a valid email is required"),
    check("password").isLength({min:8}).withMessage("must be at least 8 characters long")
], signin);


router.get("/signout", signout);

// router.get("/testroute", isSignedIn, (req,res)=>{
//    // res.send("A Protected Route");
//    res.json(req.auth);
// });

module.exports = router;