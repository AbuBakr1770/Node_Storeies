const GoogleStrategy = require('passport-google-oauth20').Strategy
const USERS = require('../models/Users')


module.exports = function(passport){
    passport.use(new GoogleStrategy({
        clientID:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:'/auth/google/callback'
        // here done is callback
    },async (accessToken,refreshToken,profile,done)=>{



        const  newUser = {
            googleID:profile.id,
            displayName:profile.displayName,
            firstName:profile.name.givenName,
            lastName:profile.name.familyName,
            image:profile.photos[0].value
        }
        
        try {
            let user = await USERS.findOne({googleID:profile.id})
            if(user){
                done(null,user)
                console.log('user exists');
            }else {
                let user = await USERS.create(newUser)
                done(null,user)
                console.log('user created');
            }
        } catch (error) {
            console.error(error)
        }

    }))

    passport.serializeUser((id,done)=>{
        done(null,id)
    })

    passport.deserializeUser(async (id,done)=>{

        try {
             const user = await USERS.findById(id)
            if(user){
                
                done(null,user)
            }
            
        } catch (error) {
            console.log(error);
            done(error,null)
        }

       
        // USERS.findById(id,(err,user)=>{
        //     done(err,user)
        // })
    })
}