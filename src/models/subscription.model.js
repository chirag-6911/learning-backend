import mongoose from "mongoose";

const subSchema = new mongoose.Schema(
    {
        subscriber:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"userModel"
        },
        channel:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"userModel"
        }
    },
    {timestamps:true}

)

export const subModel=mongoose.model("subModel",subSchema)