
import connectDb from "./DB/index.js";
import dotenv from "dotenv";
import {app} from "./app.js";

dotenv.config({
    path:'./.env'
})

connectDb()
.then(()=>{
    app.listen(process.env.port,()=>{
        console.log(`running at:${process.env.port}`)
    })
})
.catch((error)=>{
    console.log(error);
})






















// import express from "express";
// import mongoose from 'mongoose';


// const app = express();


// (async ()=>{
//     try{
//         await mongoose.connect(`mongodb+srv://chirag:chirag123@learning.vvwrrqh.mongodb.net/learning`);

//         app.on("error",(error)=>{
//             console.log(error);
//         })



//         app.listen(process.env.port,()=>{
//             console.log(`listing at :${process.env.port}`);
//         })
//     }catch(error){
//         console.log("error:",error);
//     }
// })()