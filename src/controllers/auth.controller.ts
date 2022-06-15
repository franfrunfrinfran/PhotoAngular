import {Request, Response} from 'express'
import User, {IUser} from '../models/User'

import jwt from 'jsonwebtoken';

export async function signup (req : Request, res : Response) : Promise<Response>  {
  console.log("Inicio SignUp");
    //Saving a new user
  const {username, email, password} = req.body;

  const newUser = {
        username: username,
        email: email,
        password: password
   };
   try {
    const user = new User(newUser);
    user.password = await user.encryptPassword(user.password);
    
    const savedUser = await user.save();
    
    const token: string = jwt.sign({_id: savedUser._id}, process.env.TOKEN_SECRET || 'tokenTest');
    
    return res.header('auth-token', token)
        .json({
            message:'User create',
            authToken: token,
            user: savedUser 
        });
   } catch (err) {
    console.log(err)
    return res.status(409).json({
        error: 409,
        message: "User already exists"
    })
   }
   
   //Token
           
};

export const signin = async (req : Request, res : Response) => {
    
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).json('Email or password is wrong');   
    
    const correctPassword = user.validatePassword(req.body.password);

    correctPassword
        .then(ok => {
            if(ok){
                const token =  jwt.sign({_id: user._id}, process.env.TOKEN_SECRET || 'tokentest', {
                    expiresIn: 60 * 24
                });
                
                return res.header('auth-token', token).json({authToken: token, user});
            } else {
                return res.status(400).json({
                    error: 400,
                    message: "Invalid credentials"
                });
            }
        })
        .catch(err => {
            console.log("ERROR " + err);
            return res.status(500).json({
                error: 500,
                message: "Exception"
            })
        })
};

export const profile = async (req : Request, res : Response) => {

    const user = await User.findById(req.userId, {password : 0});
    console.log(user)
    if(!user) {
        return res.status(404).json('Not found');
    }

    res.status(200).json(user);

};
