import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config({
    path:"./.env"
})



const connectdb = async()=>{
    try{
        const connectionInstance=await mongoose.connect(process.env.mongoDb)
        console.log(connectionInstance.connection.host)
    }catch(error){
        console.log("mongoDb error:",error)
    }
}

connectdb()

// import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config({
//     path: "./.env"
// });

// const connectdb = async () => {
//     try {
//         // Validate environment variable
//         if (!process.env.mongoDb) {
//             throw new Error("mongoDb environment variable is not defined");
//         }

//         const connectionInstance = await mongoose.connect(process.env.mongoDb, {
//             // Connection options
//             connectTimeoutMS: 30000,
//             serverSelectionTimeoutMS: 5000
//         });
        
//         console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
//     } catch (error) {
//         console.error("MongoDB connection error:", error);
//         process.exit(1); // Exit with error code
//     }
// };

// connectdb();
