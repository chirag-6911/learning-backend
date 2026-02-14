import {asyncHandler} from "../utilities/asyncHandler.js";
import {ApiError} from "../utilities/apiErr.js";
import {userModel} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utilities/clodinary.js";
import { ApiResponse } from "../utilities/apiRes.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";


const generateaccessAndRefreshToken=async(userId)=>{
    
    
    try{
        const user = await userModel.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken= user.generateRefreshToken()
        

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}
    }catch(error){
        console.log(error)
        // throw new ApiError(500,"something went wrong while genrating and acces token")
    }
}


const registerUser = asyncHandler(async (req,res)=>{
    // get userdata from frontend
    const {fullname, email, username, password}=req.body



    // validation
    if([fullname, email,username,password].some((field)=>field?.trim() === "")){
        throw new ApiError(400,"allfields are required");
    }


    // check if user already exists
    const userexisted=await userModel.findOne({
        $or:[{email},{username}]
    })
    if(userexisted){
        throw new ApiError(409,"user already exist")
    }


    // check for images, check for avatar
    const avatarLocalPath=req.files?.avatar[0]?.path;
    // const coverimageLocalpath=req.files?.coverimage[0]?.path;

    let coverimageLocalpath;
    if(req.files && Array.isArray(req.files.coverimage)&&req.files.coverimage.length > 0){
        coverimageLocalpath = req.files.coverimage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400,"avatar file is required");
    }



    // upload them to cloudinary
    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverimage=await uploadOnCloudinary(coverimageLocalpath)


    if(!avatar){
        throw new ApiError(400,"avatar file is required")
    }

    // creat user object - create entry in db
    const user=await userModel.create({
        fullname,
        avatar: avatar.url,
        coverimage: coverimage?.url||"",
        email,
        password,
        username:username.toLowerCase()
    })


    // remove pass and refresh token
    const createdUser=await userModel.findById(user._id).select(
        "-password -refreshToken"
    )

    // check for user creation
    if(!createdUser){
        throw new ApiError(500,"unable to register user");
    } 
    
    // return res
    return res.status(201).json(
        new ApiResponse(200,createdUser,"user registered successfully")
    )

    })

const loginUser = asyncHandler(async(req,res)=>{
    // req -> data
    
    const {username,email,password}= req.body


    // username or email
    if(!(username || email)){
        throw new ApiError(400,"username or email is required");
    }


    // check user exist or not
    const user = await userModel.findOne({
        $or:[{username},{email}]
    })
    console.log(user);
    if(!user){
        throw new ApiError(404,"user not found");
    }
    
    // username password checking
    const ispassValid=await user.isPasswordCorrect(password);
    if(!ispassValid){
        throw new ApiError(401,"invalid password")
    }


    // access and refresh token
    const {accessToken,refreshToken}=await generateaccessAndRefreshToken(user._id)

    // send cookies 
    const loggedInUser=await userModel.findById(user._id).select(
        "-password -refreshToken"
    )

    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,{
                user:loggedInUser,accessToken,refreshToken
            },
            "user logged in successfully"
        )
    )
})

const logOutUser = asyncHandler(async(req,res)=>{
    await userModel.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },{
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(
        new ApiResponse(200,{},"user loggedout")
    )
})

const refreshAccessToken =asyncHandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"unaouthoriezed request")
    }


    try {
        const decodedToken=jwt.verify(
            incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET
        )
    
        const user=await userModel.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"invalid refesh token")
        }
        // console.log("incomingToken=",incomingRefreshToken);
        // console.log("userToken=",user?.refreshToken);
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"token expired or user")
        }
    
        const options ={
            httpOnly:true,
            secure:true
        }
    
        const {accessToken,newRefreshToken}=await generateaccessAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("newRefreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken,refreshToken:newRefreshToken},
                "access token refresh"
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message || "invalid refesh token")
    }
})
export {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken
};
