import {Router} from "express";
import { registerUser,loginUser, logOutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser } from "../contollers/user.controller.js";
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

router.route("/changePassword").post(changeCurrentPassword)
router.route("/current-user").post(getCurrentUser)



export default router;