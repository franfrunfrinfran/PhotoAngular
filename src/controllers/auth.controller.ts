import {Request, Response} from 'express'
import User, {IUser} from '../models/User'

import jwt from 'jsonwebtoken';
import { idText } from 'typescript';

export async function signup (req : Request, res : Response) : Promise<Response>  {
  
    //Saving a new user
  const {username, email, password} = req.body;

  const newUser = {
        username: username,
        email: email,
        password: password
   };
   const user = new User(newUser);
   user.password = await user.encryptPassword(user.password);
   const savedUser = await user.save();
   //Token
   
   const token: string = jwt.sign({_id: savedUser._id}, process.env.TOKEN_SECRET || 'tokenTest');

    return res.header('auth-token', token)
        .json({
            message:'User create',
            savedUser 
        });
           
};

export const signin = async (req : Request, res : Response) => {
    
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).json('Email or password is wrong');   

    const correctPassword = user.validatePassword(req.body.password);
    if(!correctPassword) return res.status(400).json('Invalid Password');
    //token
    const token =  jwt.sign({_id: user._id}, process.env.TOKEN_SECRET || 'tokentest', {
        expiresIn: 60 * 24
    });

    res.header('auth-token', token).json(user);
};

export const profile = async(req : Request, res : Response) => {
    console.log(req.header('auth-token'));
    const user = await User.findById(req.userId, {password : 0});
    if(!user) return res.status(404).json('Not found');
    res.json(user);

};