const mongoose = require('mongoose')

const storySchema = new mongoose.Schema({
    body:{
        type:String,
        required:true,
        trim:true
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    status:{
        type:String,
        default:'public',
        enum:['public','private']
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'

    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const Stories = mongoose.model('Stories',storySchema)

module.exports = Stories