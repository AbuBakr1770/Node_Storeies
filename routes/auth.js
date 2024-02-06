const express = require('express')
const passport = require('passport')
const Router = express.Router()


//@ route GET to /auth/google

Router.route('/google').get(passport.authenticate('google',{
    scope:['profile']
}))

//@ route GET to /auth/google/callback
Router.route('/google/callback').get(passport.authenticate('google',{
    failureRedirect:'/'
}),(req,res,next)=>{
    res.redirect('/dashboard')
})

//@ route GET to /auth/logout
Router.route('/logout').get((req, res) => {
    req.logOut(function(err) {
        if (err) {
            // Handle error, e.g., log it or send an error response
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        // If successful logout, redirect to the home page or any other desired location
        res.redirect('/login');
    });
});


module.exports = Router