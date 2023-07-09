import jwt from 'jsonwebtoken'

export const verifyToken=async(req,res,next)=>{
    try{
        let token=req.header("Authorization")
        if(!token){
            return res.status(403).send({message:"No Token Provided"})
            }
            if(token.startsWIth("Bearer ")){
                token=token.slice(7,token.length).trimLeft()
            }
            const verified=jwt.verify(token,process.env.Jwt_secret)
            req.user=verified
            next()
    }catch(err){
        res.status(500).json({msg:err.message})
    }
} 