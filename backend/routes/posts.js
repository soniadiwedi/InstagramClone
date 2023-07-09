import express from "express"
import { verifyToken } from "../middleware/auth.js"
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js"

const postRouter=express.Router()


/* READ   
 getFeedPosts  */ 
 postRouter.get("/",verifyToken,getFeedPosts)
// getUserPosts
postRouter.get("/:userId/posts",verifyToken,getUserPosts)


// UPDATE- likePost
postRouter.patch("/:id/like",verifyToken,likePost)


export default postRouter