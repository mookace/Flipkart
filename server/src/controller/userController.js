const User=require('../models/user')
const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken')
const saltRounds = 10





const user={}

//get all user
user.getAllUsers=async(req,res)=>{

    const query = req.query.new;
    try {
        const users = query ? await User.find().sort({ _id: -1 }).limit(10) : await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({message:`can't get all users`,err});
    }
}


//user Register
user.register=async(req,res)=>{

    try {
        const checkEmail=await User.findOne({email:req.body.email})
        const checkUsername=await User.findOne({username:req.body.username})

        if(checkEmail && checkUsername){
            return res.status(400).json({message:'Username and Email already exist'})
        }else if(checkEmail){
            return res.status(400).json({message:'Email already exist'})
        }else if(checkUsername){
            return res.status(400).json({message:'Username already exist'})
        }else if(!checkEmail && !checkUsername){
            const newUser= new User({
                username:req.body.username,
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                password:bcrypt.hashSync(req.body.password,saltRounds),
            })
    
            const savedUser=await newUser.save()
            res.status(200).json(savedUser)
            
        }
        
        
    } catch (error) {
        res.status(500).json({message:'error on saving new User',error})
        
    }
}

//User Login
user.login=async(req,res)=>{
    try {
        const user=await User.findOne({email:req.body.email})
    if(!user){
        return res.status(401).json({message:'wrong credentials'})
    }

    const originalpassword= await bcrypt.compareSync(req.body.password,user.password)
    if(!originalpassword){
        return res.status(401).json({message:'wrong password'})
    }

    const acessToken=jwt.sign({
        id:User._id
    },process.env.JWT_SEC,{expiresIn:'24h'})

    const {firstname,lastname,email,role} = user
    res.status(200).json({
        user:{
        firstname,lastname,email,role
        },
        acessToken
    })
    } catch (error) {
        return res.status(500).json(error)
    }
}






module.exports=user