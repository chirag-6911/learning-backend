import {asyncHandler} from "../utilities/asyncHandler.js";
import {ApiError} from "../utilities/apiErr.js";
import {userModel} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utilities/clodinary.js";
import { ApiResponse } from "../utilities/apiRes.js";


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
    const coverimageLocalpath=req.files?.coverimage[0]?.path;

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


export {registerUser};