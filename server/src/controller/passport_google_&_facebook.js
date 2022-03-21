const passport=require('passport')
const User=require('../models/user')
const generator = require('generate-password');
const bcrypt=require('bcrypt')

passport.serializeUser((user,done)=>{
    done(null,user.id)
})

passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(null,user)
    })
})


const GoogleStrategy = require('passport-google-oauth20').Strategy;

    passport.use(new GoogleStrategy({
        clientID:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/google/callback",
        // passReqToCallback:true
    },
    function(request,accessToken, refreshToken, profile, done) {

        const gmailpassword = generator.generate({
            length: 15,
            numbers: true,
            symbols:true,
        })

        User.findOne({googleId:profile.id}).then((currentUser)=>{
            if(currentUser){
                done(null,currentUser)
            }else{
                new User({
                    googleId:profile.id,
                    username:profile.displayName,
                    firstname:profile.name.givenName,
                    lastname:profile.name.familyName,
                    email:profile.emails[0].value,
                    password:bcrypt.hashSync(gmailpassword,15),
                    profilePicture:profile.photos[0].value,
                }).save().then((newUser)=>{
                    done(null,newUser)
                })
            }
        })
        
        
    }
    ));


//Facebook login

const FacebookStrategy=require('passport-facebook').Strategy

    passport.use(new FacebookStrategy({
        clientID:process.env.FACEBOOK_APP_ID,
        clientSecret:process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:5000/api/google/callback",
        
    },
    function(request,accessToken, refreshToken, profile, done) {

        const facebookpassword = generator.generate({
            length: 15,
            numbers: true,
            symbols:true,
        })

        User.findOne({facebookId:profile.id}).then((currentUser)=>{
            if(currentUser){
                done(null,currentUser)
            }else{
                new User({
                    facebookId:profile.id,
                    username:profile.displayName,
                    firstname:profile.name.givenName,
                    lastname:profile.name.familyName,
                    email:profile.emails[0].value,
                    password:bcrypt.hashSync(gmailpassword,15),
                    profilePicture:profile.photos[0].value,
                }).save().then((newUser)=>{
                    done(null,newUser)
                })
            }
        })
        
        
    }
    ));


