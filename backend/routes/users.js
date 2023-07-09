import  express from "express";
import { verifyToken } from "../middleware/auth.js"
import User from "../models/User.js";

const userRouter=express.Router()


/* Read*/
userRouter.get("/:id",verifyToken,async(req,res)=>{
    try{
        const {id}=req.params
        const user =await User.findById(id)
        res.status(200).json(user)
    }catch(err){
        res.status(404).json({"msg":err.message})
    }
})

userRouter.get("/:id/friendId",verifyToken,async(req,res)=>{
    try{
        const {id}=req.params
        const user=await User.findById(id)
        const friends= await Promise.all(user.friends.map((id)=>User.findById(id)))
        const formattedFriends=friends.map(({_id,firstName,lastName,occupation,location,picturePath})=>{
            return {_id,firstName,lastName,occupation,location,picturePath}
        })
        res.status(200).json(formattedFriends)
    }catch(err){
        res.status(404).json({"msg":err.message})
    }
})

/* Update addRemoveFriend*/
userRouter.patch("/:id/:friendId",verifyToken,async(req,res)=>{
    try{
        const {id,friendId}=req.params
        const user=await User.findById(id)
        const friend=await User.findById(friendId)
        if(user.friends.includes(friendId)){
            user.friends=user.friends.filter((id)=>id!==friendId)
            friend.friends=friend.friends.filter((id)=>id!==id)
        }else{
            user.friends.push(friendId)
            friend.friends.push(id)
        }
        const friends= await Promise.all(user.friends.map((id)=>User.findById(id)))
        const formattedFriends=friends.map(({_id,firstName,lastName,occupation,location,picturePath})=>{
            return {_id,firstName,lastName,occupation,location,picturePath}
        })
        res.status(200).json(formattedFriends)
    }catch(err){
        res.status(404).json({"msg":err.message})
    }
})

export default userRouter