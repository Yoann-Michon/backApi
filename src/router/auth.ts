import { Router } from "express";
import { User } from "..";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const authRouter =  Router();
const saltRounds =10;

export interface IJwtInfo {
    userId: number
}

authRouter.post("/auth/add",async (req,res) => {

    const hash = await bcrypt.hash(req.body.password, saltRounds);
    const log = await User.findOne({where: {login: req.body.login}});
    const newlog = await User.create({login: req.body.login, password: hash});
  
    if (log){
      res.status(400).send('utilisateur existant')
    }else {
      delete newlog.dataValues.password;
      res.json({
        newlog
      });
    }
  });

  authRouter.post("auth/connect",async (req,res)=>{
    const log=await User.findOne({where:{login: req.body.login}});
    if (log){
    const match = await bcrypt.compare(req.body.password, log.dataValues.password)

        if(match){
            const dataToSign: IJwtInfo = { userId: log.dataValues.id }
            const token = jwt.sign(dataToSign, process.env.JWT_SECRET!, { expiresIn: '1h' });
            res.json({
              token
            });
          }
          else {
            res.status(400).json({ error: "mot de passe incorrect"});
          }
        }else{
          res.status(400).json({ error: "utilisateur n'existe pas"});
        }
  })