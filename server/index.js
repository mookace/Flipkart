const express=require('express')
const app=express()
const dotenv=require('dotenv')
dotenv.config()
const mongoose=require('mongoose')
const passport = require('passport');
const cookieSession=require('cookie-session')

//Routes

const userRoutes=require('./src/user')
const adminRoutes=require('./src/routes/admin');


const PORT=process.env.PORT

mongoose.connect(process.env.Mongo_url)
.then(console.log('sucessfullly connected to database '))
.catch((err)=>console.log(err))


app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.set("view engine","ejs")

app.use(cookieSession({
    maxAge:'1d',
    keys:[process.env.CookieKey]
}))

app.use(passport.initialize())
app.use(passport.session())


app.get('/',(req,res)=>{
    res.render("login")
})




app.use('/api',userRoutes)
app.use('/api',adminRoutes)



app.listen(PORT,()=>{
    console.log(`server is connected on port ${PORT}`)
})
