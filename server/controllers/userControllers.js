const userModel =require( "../models/userModel.js")
const asyncHandler =require( "express-async-handler")
const generateToken =require( "../config/generateToken.js");

const registerUser=asyncHandler(async (req,res)=>{
    console.log(req.body)
    const {name,email,password,pic}=req.body;

    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please Enter All The Fields");
    }
    const userExist= await userModel.findOne({email})

    if(userExist){
        res.status(400)
        throw new Error("User already Exist")
    }

    const user= await userModel.create({
        name,
        email,
        password,
        pic
    })

    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id)
        })
    }else{
        res.status(400);
        throw new Error("Failed to Create the User");
    }

});

const loginUser= asyncHandler(async(req,res)=>{
    const {email,password}=req.body;

    const user =await userModel.findOne({email});
    
    if (user && (await user.matchPassword(password))){
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id)
        })
    }else{
        res.status(400);
        throw new Error("Failed to Login")
    }
})

// api/user?search=col
const allUsers=asyncHandler(async(req,res)=>{
    const keyword=req.query.search?{
        $or:[
            {name:{$regex:req.query.search, $options:"i"}},
            {email:{$regex:req.query.search, $options:"i"}}
        ]
    }:{}

    const users=await userModel.find(keyword).find({_id:{$ne:req.user._id}})
    res.send(users)
})

module.exports={registerUser,loginUser,allUsers}