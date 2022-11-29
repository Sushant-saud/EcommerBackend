const jwt = require("jsonwebtoken");
const varifyToken = (req, res, next) => {
    const authHeader=req.headers.token;
    if (authHeader) {
        const token=authHeader.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err) res.status(403).send("Token is not valid");
            req.user = user;
            next();
        })
    }
    else {
        return res.status(401).json("JWT is not Varify");
    }
}
const varifyTokenAndAuthorization = (req, res, next) => {
    varifyToken(req,res,()=>{
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        }
        else{
            res.status(403).send("You are not allow to do that")
        }
    })
    
}
const varifyTokenAndAdmin= (req, res, next) => {
    varifyToken(req,res,()=>{
        if(req.user.isAdmin)
        {
            next();
        }
        else{
            res.status(403).send("You are not allow to do that")
        }
    })

    
}


module.exports ={varifyToken,varifyTokenAndAuthorization,varifyTokenAndAdmin};