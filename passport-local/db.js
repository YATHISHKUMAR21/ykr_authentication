const mongoose = require('mongoose')
const passport = require('passport')

exports.connectMongoose = ()=>{
    mongoose.connect('mongodb://localhost:27017/passport-local').then(()=>{
        console.log("db connected")
    }).catch((err)=>{
        console.log(err)
    })
}

const userSchema = new mongoose.Schema({
    name : String,
    username : {
        type : String,
        required : true,
        unique : true
    },
    password : String
})


exports.User = mongoose.model("User", userSchema);