const express = require("express");
const app=express();
const userData=require("./mongoose");
const PORT=3000;
const bcrypt=require("bcrypt");
const {createToken,validateToken}=require("./jwt");
const cookieParser=require("cookie-parser");
const validator=require("email-validator");
const { passwordStrength } = require('check-password-strength')

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.set("view engine","hbs");
app.use(express.urlencoded({ extended: false }))


app.get("/signup",(req,res)=>{
    res.render("signup");
})

app.get("/",(req,res)=>{
    res.render("login");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.post("/signup",async (req,res)=>{
    const data={
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
    }
    const existingUserData=await userData.findOne({username:data.username});
       if(existingUserData)return res.render("UserExists");
       else if(!(validator.validate(data.email)))return res.render("wrongEmail")
       else if(!(passwordStrength(data.password).id==3)){
        console.log(passwordStrength(data.password));
        return res.render("weakPassword")}
        else{
            try{
            const passwordHash=await bcrypt.hash(data.password,10);
            data.password=passwordHash;
            const newUser= await userData.create(data);
            const token=createToken(newUser);
            res.cookie("login-token",token,{maxAge:3600000});
            return res.redirect("/dashboard");
            }
            catch(error){
                res.send("error")
            }
    }   
})

app.post("/login",async (req,res)=>{
    const data={
        username:req.body.username,
        password:req.body.password,
    }
    const existingUserData=await userData.findOne({username:data.username});
    if(!existingUserData)res.render("NoUser");  
    else{
        const pass=existingUserData.password;
        bcrypt.compare(data.password,pass).then((match)=>{
            if(!match){
                console.log("wrong password")
                res.render("NotAuth");
            }
            else{
                const token=createToken(existingUserData);
                res.cookie("login-token",token,{maxAge:3600000});
                return res.redirect("/dashboard");
            }
        })}
})

app.get("/dashboard",validateToken,async (req,res)=>{
    try{const user = await userData.findOne({username:req.user.username});

    res.render("dashboard",{ user });
    }catch{
        res.send("error");
    }

})

app.get("/logout",(req,res)=>{
    res.clearCookie("login-token");
    res.redirect("/login");
})

app.listen(PORT,()=>{
    console.log("port connected");
})