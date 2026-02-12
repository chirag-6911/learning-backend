import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema(
    {
        videoFile:{
            type:String,
            required:true
        },
        thumbnail:{
            type:String,
            required:true
        },
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        duration:{
            type:Number,
            defaul:0
        },
        views:{
            type:Number,
            defaul:0
        },
        isPublished:{
            type:Boolean,
            defaul:true
        },
        owner:{
            type:mongoose.Model.Types.ObjectId,
            ref:"user"
        }

    },
    {
        timeStamps:true
    }

);


videoSchema.plugin(mongooseAggregatePaginate)


export const videoModel = mongoose.model("video",videoSchema);