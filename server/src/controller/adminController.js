const User=require('../models/user')
const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken')
const saltRounds = 10
const passport=require('passport')
const GOOGLE_CLIENT_ID=process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET=process.env.GOOGLE_CLIENT_SECRET



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
                role:'admin'
            })
    
            const savedUser=await newUser.save()
            res.status(200).json(savedUser)
            
        }
        
        
    } catch (error) {
        res.status(500).json({message:'error on saving new Admin',error})
        
    }
}

//User Login
user.login=async(req,res)=>{
    try {
        const user=await User.findOne({email:req.body.email})
    if(!user){
        res.status(401).json({message:'wrong credentials'})
    }

    const originalpassword= await bcrypt.compareSync(req.body.password,user.password)

    if(originalpassword && user.role==='admin'){

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
        
    }else if(!originalpassword){
        res.status(401).json({message:'wrong password'})
    }else{
        res.status(401).json({message:'Login error'})
        
    }

    
    } catch (error) {
        res.status(500).json(error)
    }
}

user.googleLogin=async(req,res)=>{

    const GoogleStrategy = require('passport-google-oauth20').Strategy;

    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/getallusers"
    },
    function(accessToken, refreshToken, profile, cb) {
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        // return cb(err, user);
        // });

        return cb(err, profile);
    }
    ));

    passport.serializeUser((user,done)=>{
        done(null,user)
    })

    passport.deserializeUser((user,done)=>{
        done(null,user)
    })

}






//profile
user.userprofile=(req,res)=>{
    res.status(200).json({message:'profile'})
}





module.exports=user