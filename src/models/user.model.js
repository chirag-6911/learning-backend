import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema(
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
        avatat:{
            type:String,//url
            required:true
        },
        coverimage:{
            type:String//url
        },
        watchHistory:[
            {
                type:mongoose.Schema.Types.ObjectId,
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
    if(!this.isModified("password")) return next()
    this.password=bcrypt.hash(this.password)
    next()
})


userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    jwt.sign(
        {
            _id: this._id,
            fullname: this.fullname,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:ACCESS_TOKEN_EXPIRY
        }
    )
};
userSchema.methods.generateRefreshToken = function(){
    jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,{
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
};



export const userModel = mongoose.model("user",userSchema);