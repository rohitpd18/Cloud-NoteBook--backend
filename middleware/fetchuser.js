const jwt = require("jsonwebtoken");

// const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET = "rohtQ@$";

const fetchuser=(req, res, next)=>{

    // Get the user form the jwt token and id to req the object
    const token=req.header('auth-token')
    if(!token){
        return res
          .status(400)
          .json({ error: "Some internal issue"});
    }
    try {
        const data= jwt.verify(token, JWT_SECRET)
        req.user= data.user;
        next()

    } catch (error) {
        return res
          .status(400)
          .json(error);
    }
}

module.exports= fetchuser