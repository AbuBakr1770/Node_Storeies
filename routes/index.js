const express = require('express')
const Router = express.Router()
const {ensureAuth,ensureGuest} = require('../middleware/authMW')
const Stories = require('../models/Stories')


Router.route('/login').get(ensureGuest, (req,res,next)=>{

    res.render('login',{
        layout:'login'
    })
})

Router.route('/dashboard').get(ensureAuth, async (req,res,next)=>{

    try {
        const stories = await Stories.find({user:req.user.id}).lean()
        res.render('dashboard',{
            name:req.user.firstName,
            stories:stories,
        })
    } catch (error) {
        console.log(error);
        res.render('error/500')
    }

})




module.exports = Router