import { errorhandler } from "./error.js";
import jwt from "jsonwebtoken";



export const verifyToken = (req,res,next) => {
    const token=req.cookies.access_token;

    if(!token) return next(errorhandler(401,'Unauthorized access token'));
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err) return next(errorhandler(403,'Forbidden access token'));

        req.user=user;
        next();
    });
}