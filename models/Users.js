const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
        googleID:{
            type:String,
            required:true
        },
        displayName:{
            type:String,
            required:true
        },
        firstName:{
            type:String,
            required:true
        },
        lastName :{
            type:String,
            required:true,
            default:'no last name'
        },
        image:{
            type:String,
           
        },
        createdAt:{
            type: Date,
            default:Date.now
        }
})

const USERS = mongoose.model('Users',userSchema)

module.exports = USERS