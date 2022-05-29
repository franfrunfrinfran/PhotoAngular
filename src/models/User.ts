import {Schema, model, Document} from 'mongoose';
import bcryptjs from 'bcryptjs';


export interface IUser{
   
    username: string,
    email: string,
    password: string,
    encryptPassword(password: string): Promise<string>;
    validatePassword(password: string): Promise<boolean>;
};

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        min: 4,
        lowercase: true
    },
    email:{
        type: String,
       //unique: true,
        required: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true
    }
});
userSchema.methods.encryptPassword = async (password : string): Promise<string> =>{
    const salt = await bcryptjs.genSalt(10);
    return bcryptjs.hash(password, salt);
};
userSchema.methods.validatePassword = async function (password: string): Promise<boolean>{
   return await bcryptjs.compare(password, this.password);
};

export default model<IUser>('User', userSchema);