const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        trim:true,
        min:2,
        max:20
    },
    lastname:{
        type:String,
        required:true,
        trim:true,
        min:2,
        max:20,
    },
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        index:true,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,

    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user',
    },
    contactNumber:{type:String},
    profilePicture:{type:String},
    googleId:{type:String},
    facebookId:{type:String},
},{timestamps:true})


module.exports=mongoose.model('User',userSchema)