import {Router} from "express";
import { registerUser,loginUser, logOutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateUserDetail, updateAvatar, updateCoverImage, getUserChannelProfile, getWatchHistory } from "../contollers/user.controller.js";
import {upload} from "../middelware/multer.middelware.js"
import { verifyJWT } from "../middelware/aouth.middelware.js";


const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },{
            name:"coverimage",
            maxCount:1
        }
    ]),
    registerUser
);
router.route("/login").post(loginUser);


//secured route
router.route("/logout").post(verifyJWT,logOutUser)


router.route("/refresh-token").post(refreshAccessToken)

router.route("/changePassword").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").post(verifyJWT,getCurrentUser)
router.route("/update-userdetails").patch(verifyJWT,updateUserDetail)
router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),updateAvatar)
router.route("/update-coverimage").patch(verifyJWT,upload.single("coverimage"),updateCoverImage)


router.route("/c/:username").get( getUserChannelProfile)
rotuter.Router("/history").get(verifyJWT,getWatchHistory)





export default router;

    // updateUserDetail,
    // updateAvatar,
    // updateCoverImage,
    // getUserChannelProfile,
    // getWatchHistory