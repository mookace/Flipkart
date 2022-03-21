const {check,validationResult}=require('express-validator');

exports.validateRegisterRequest=[
    check('firstname').notEmpty().withMessage('firstname is required'),
    check('lastname').notEmpty().withMessage('lastname is required'),
    check('username').notEmpty().withMessage('username is required'),
    check('password').notEmpty().withMessage('password is required'),
    check('email').notEmpty().withMessage('email is required'),
]

exports.validateLoginRequest=[
    check('email').notEmpty().withMessage('email is required'),
    check('password').notEmpty().withMessage('password is required'),
]

exports.isRequestValidates=(req,res,next)=>{
    const errors=validationResult(req)
    if(errors.array().length>0){
        return res.status(400).json({error:errors.array()[0].msg})
    }
    next()
}