import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import { errorhandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'


export const singup= async (req,res,next)=>{
    const {username,password,email} = req.body;
    const hashedpassword=bcryptjs.hashSync(password,10);
    const newUser = new User({username,password:hashedpassword,email});
    try {
        await newUser.save();
        res.status(201).json('User created successfully!');
    } catch (error) {
        // res.status(500).json(error.message);
        // next(errorhandler(500,'error is working for errorhandler function'));
        next(error)
;    }
};



export const signin = async (req, res, next)=>{
    const {email,password} = req.body;
    try {
        const validUser=await User.findOne({email});
        if(!validUser) return next(errorhandler(404,'User not found'));
        const validPassword= bcryptjs.compareSync(password,validUser.password);
        if(!validPassword) return next(errorhandler(401,'Worong credentials'));
        const token=jwt.sign({id:validUser._id},process.env.JWT_SECRET);
        const {password: pass, ...rest} =validUser._doc;
        res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
    } catch (error) {
        console.log(error);
        next(error);
    }
}


export const google= async (req, res,next) => {
    try {
        const user= await User.findOne({email:req.body.email})
        if (user){
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET);
            const {password: pass,...rest} =user._doc;
            res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
        }else{
            const generatePassword=Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword=bcryptjs.hashSync(generatePassword,10);
            const newUser = new User({username:req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),password:hashedPassword,email:req.body.email,avatar:req.body.photo});
            await newUser.save();
            const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET);
            const {password: pass,...rest} =newUser._doc;
            res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
        }
    } catch (error) {
        next(error);
    }
}


export const signout = (req,res,next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json({message:'User signed out'});
    } catch (error) {
        next(error);
    }
}