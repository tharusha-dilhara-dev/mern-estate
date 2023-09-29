import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import { errorhandler } from "../utils/error.js";


export const singup= async (req,res,next)=>{
    const {username,password,email} = req.body;
    const hashedpassword=bcryptjs.hashSync(password,10);
    const newUser = new User({username,password:hashedpassword,email});
    try {
        await newUser.save();
        res.status(201).json('User created successfully!');
    } catch (error) {
        // res.status(500).json(error.message);
        next(errorhandler(500,'error is working for errorhandler function'));
        
    }
};