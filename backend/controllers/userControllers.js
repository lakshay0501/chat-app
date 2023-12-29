const asyncHandler = require("express-async-handler");
const User = require('../models/userModel');
const generateToken = require('../config/generateToken')
const dotenv = require('dotenv');
const connectDB = require("../config/db");

dotenv.config();
// connectDB();

const registerUser = asyncHandler(async(req,res) => {
   const {name,email,password,pic} = req.body
   console.log(name,password,email)
   if(!name || !email || !password){
     res.status(400)
     throw new Error("Please enter all the fields")
   }

   const userExists = await User.findOne({email});
    // console.log(userExists,"######")
   if(userExists){
    res.status(400);
    throw new Error("User already exists");
   }
   
   const user = await User.create({
     name,
     email,
     password,
     pic,
   })
  //  console.log(user,"********")
   if(user){
    res.status(201).json({
        _id:user._id,
        name:user.name,
        email:user.email,
        pic:user.pic,
        token: generateToken(user._id),
    })
   }
   else{
     
     res.status(400);
     throw new Error("Failed to create the user");
   }
});

const authUser = asyncHandler(async(req,res)=> {
    
  const {email,password} = req.body;
  console.log(req.body)
  console.log(email,password)
  const user = await User.findOne({email});
  console.log(user);
 
  // if user is found and the password matches, then login user
  if(user && (await user.MatchPassword(password))){
     res.json({
        _id:user._id,
        name:user.name,
        email:user.email,
        pic:user.pic,
        token:generateToken(user._id),
     })
  } 
  else{
    res.status(401);
    throw new Error("Invalid Email or password")
  }
});

// /api/user/:id?search=lakshay
const allUsers = asyncHandler(async(req,res)=>{
   const keyword = req.query.search ? {
      $or: [
        {name : {$regex: req.query.search,$options:"i"}},
        {email:{$regex:req.query.search,$options:"i"}},
      ]
   }
   :{};
   
   const users = await User.find(keyword)
   res.send(users)
})

module.exports = { registerUser,authUser,allUsers }