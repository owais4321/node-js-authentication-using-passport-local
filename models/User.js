const mongoose=require('mongoose');
const userschema= new mongoose.Schema({
name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
},
date:{
    type:Date,
    default:Date.now
},
});

const User=mongoose.model('User',userschema);

module.exports=User;