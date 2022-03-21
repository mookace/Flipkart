const jwt=require('jsonwebtoken')

const verifyToken=(req,res,next)=>{
    const token=req.headers.authorization.split(' ')[1]
    if(token){
        jwt.verify(token,process.env.JWT_SEC,(error,user)=>{
            if(error) res.status(400).json('Token is not valid')
            req.user=user
            next()
        })

    }else{
        return res.status(400).json('you are not allow to do that')
    }
}

module.exports=verifyToken