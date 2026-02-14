import { ApiError } from "../utilities/apiErr.js"
import { asyncHandler } from "../utilities/asyncHandler.js"
import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model.js";
import cookieParser from "cookie-parser";



export const verifyJWT = asyncHandler(async(req,res,next) => {
    try {
        console.log(req.cookies.accessToken)
        const token=req.cookies?.accessToken || req.header("authentication")?.replace("bearer","")
        console.log(token)
        if(!token){
            console.log(token)
            throw new ApiError(401,"unauthorized request")
        }
        
        const decodeToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const user = await userModel.findById(decodeToken?._id).select(
            "-password -refreshToken"
        )
    
        if(!user){
            throw new ApiError(401,error?.message || "invalid Access");
        }
    
        req.user = user;
        next()
    } catch (error) {
        console.log(error);
        throw new ApiError(401,"invalid Accesstoken")
    }
})