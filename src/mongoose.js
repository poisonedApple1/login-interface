const mongoose=require("mongoose")

mongoose.connect("mongodb://localhost:27017/BHMinterview")
.then(()=>{
    console.log("mongoDB connected")
})
.catch(()=>{
    console.log("mongoDB failed to connect")
})

const loginSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,},
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
},
})

const collection= new mongoose.model('LoginCollection3',loginSchema);
module.exports=collection;