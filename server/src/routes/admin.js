
const express=require('express');
const { login, register, googleLogin, getAllUsers} = require('../controller/adminController')
const verifyToken=require('../middleware/verifyToken')
const router=express.Router()
const {validateRegisterRequest,validateLoginRequest,isRequestValidates}=require('../validators/validates')

//get all user
router.get('/admin/getallusers',getAllUsers)


//Register user
router.post('/admin/register',validateRegisterRequest,isRequestValidates,register)

//Login user
router.post('/admin/login',validateLoginRequest,isRequestValidates,login)

router.get('/admin/login/google',googleLogin)





module.exports=router