import  express  from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import userrouter from "./routes/user.route.js";
import authrouter from "./routes/auth.route.js";

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


app.use('/api',userrouter);
app.use('/api/auth',authrouter);


app.listen(3000,()=>{
    console.log("server is runnin onnport 3000 !");
})