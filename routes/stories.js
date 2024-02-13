const express = require('express')
const Router = express.Router()
const {ensureAuth} = require('../middleware/authMW')
const Stories = require('../models/Stories')


Router.route('/add').get(ensureAuth, (req,res,next)=>{
    res.render('stories/add')
})

Router.route('/:id').get(ensureAuth, async (req,res,next)=>{
    try {
        let story = await Stories.findById(req.params.id).populate('user').lean()
        if(!story){
            res.render('error/404')
        }
        else{
            res.render('stories/show',{story})
        }

    } catch (err) {
        console.log(err);
        res.render('error/500')
        
    }
})


Router.route('/').post(ensureAuth,async (req,res,next)=>{
    try {
        
        req.body.user = req.user.id
        // console.log(req.body);

        const newStory = {
            title:req.body.title,
            status:req.body.status,
            body:req.body.body123,
            user:req.body.user
        }

       await Stories.create(newStory)
       

        res.redirect('/dashboard')
    } catch (error) {
        console.log(error);
        res.render('error/500')
    }
})

Router.route('/').get(ensureAuth,async (req,res,next)=>{
    try {

        const stories = await Stories.find({status:'public'}).populate('user').sort({createdAt:'desc'}).lean()

        res.render('stories/index',{
            stories
        })
        
    } catch (error) {
        console.log(error);
        res.render('error/500')
    }
})

Router.route('/edit/:id').get(ensureAuth, async (req,res,next)=>{
    const story = await Stories.findOne({_id:req.params.id}).lean()


if(!story){
    return res.render('error/404')
}

if(story.user != req.user.id){
    res.redirect('/stories')
    // console.log('storyUser:', req.user);
    // console.log('loggedUser:', loggedUser);
}else {
   console.log(story);
    res.render('stories/edit',{
        story,
    })
}

})

Router.route('/:id').put(ensureAuth,async (req,res,next)=>{
    let story = await Stories.findById(req.params.id).lean()

    if(!story){
        res.render('error/404')
    }

    if(story.user != req.user.id){
        res.redirect('/stories')
        // console.log('storyUser:', req.user);
        // console.log('loggedUser:', loggedUser);
    }else {
      story = await Stories.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    }

    res.redirect('/dashboard')

})

Router.route('/:id').delete(ensureAuth,async (req,res,next)=>{
    try {
        let story = await Stories.findById(req.params.id)
        if(!story){
            res.render('error/404')
        }else {
            story = await Stories.findByIdAndDelete(req.params.id)
        }

        res.redirect('/dashboard')
    } catch (error) {
        console.log(error);
        res.redirect('error/500')
        
    }
})

Router.route('/user/:userId').get(ensureAuth, async (req,res,next)=>{
    try {
        let stories = await Stories.find({id:req.params.userId,status:'public'}).populate().lean()
        
        res.render('stories/index',{stories})

    } catch (error) {
        console.log(error);
        res.render('error/500')
    }
})






module.exports = Router