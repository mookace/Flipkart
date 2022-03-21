
const express=require('express');
const { validationResult } = require('express-validator');
const passport = require('passport');
const { login, register,userprofile, googleLogin, getAllUsers} = require('./controller/userController');
const authcheck = require('./middleware/authCheck');
const verifyToken=require('./middleware/verifyToken')
const router=express.Router()
const { validateRegisterRequest,validateLoginRequest,isRequestValidates } = require('./validators/validates');

require('./controller/passport_google_&_facebook')


//get all user
router.get('/getallusers',authcheck,getAllUsers)


//Register user
router.post('/register',validateRegisterRequest,isRequestValidates,register)

//Login user
router.post('/login',validateLoginRequest,isRequestValidates,login)

//google login
router.get('/login/google',passport.authenticate('google',{scope:['email','profile',]}))

//
router.get('/google/callback',passport.authenticate('google'),(req,res)=>{
    res.redirect('/api/getallusers')
})

//Facebook login
router.get('/login/facebook',passport.authenticate('facebook',{scope:['email','profile']}))

//
router.get('/google/callback',passport.authenticate('facebook'),(req,res)=>{
    res.redirect('/api/getallusers')
})

//LogOut

router.get('/logout',(req,res)=>{
    req.logOut()
    res.redirect('/')
})


module.exports=router