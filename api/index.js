import  express  from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import userrouter from "./routes/user.route.js";
import authrouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import listingrouter from "./routes/listing.router.js";

dotenv.config();

mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log('connect to database')
})
.catch((err)=>{
    console.log(err);
});

const app=express();
app.use(express.json());
app.use(cookieParser());


app.use('/api/user',userrouter);
app.use('/api/auth',authrouter);
app.use('/api/listing',listingrouter);



app.use((err,req,res,next)=>{
    const statecode=err.statecode || 500;
    const message=err.message || 'internal server error';
    return res.status(statecode).json({
        success:false,
        statecode,
        message
    });
});

app.listen(3000,()=>{
    console.log("server is runnin onnport 3000 !");
})