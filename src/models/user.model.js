import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Schema } from "mongoose";
dotenv.config()


const userSchema = new Schema(
    {
        
        username:{
            type:String,
            unique:true,
            required:true,
            lowercase:true,
            index:true,
            trim:true
        },
        email:{
            type:String,
            unique:true,
            required:true,
            lowercase:true,
            trim:true
        },
        fullname:{
            type:String,
            required:true,
            index:true,
            trim:true
        },
        avatar:{
            type:String,//url
            required:true
        },
        coverimage:{
            type:String//url
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"video"
            }
        ],
        password:{
            type:String,
            required:true
        },
        refreshToken:{
            type:String
        }
    },
    {timestamps:true}

);

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return 
    this.password=await bcrypt.hash(this.password,10)
})


userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            fullname: this.fullname,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
};
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,{
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
};



export const userModel = mongoose.model("userModel",userSchema);