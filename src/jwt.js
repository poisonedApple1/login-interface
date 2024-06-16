const {sign,verify}=require("jsonwebtoken");

const createToken=(user)=>{
    const accessToken=sign({username: user.username , password:user.password},"amanDegala123456789");
    return accessToken;
}

const validateToken=(req,res,next)=>{
    const loginToken=req.cookies["login-token"];
    if(!loginToken){res.redirect("login");}
    try{
        const authorized=verify(loginToken,"amanDegala123456789");
        if(authorized){
            req.authenticated = true;
            req.user=authorized;
            return next();
        }
    }catch(error){
        console.log("wrong token")
        return res.render("NotAuth");
    }
}

    

module.exports={createToken,validateToken};
