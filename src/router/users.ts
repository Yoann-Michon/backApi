import { Router } from "express";
import { User } from "..";

export const userRouter = Router();

userRouter.get("/",async (req,res) => {
    
    const user = await User.findOne({where: { id: req.userId }})
    if(user){
        res.json({
            user
        })
    }
});

