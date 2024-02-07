import mongoose from "mongoose";
import validator from "validator";
import { StatusError } from "../lib/errorHelper.js";
import { comparePassword, hashPassword } from "../lib/authenticateHelper.js";
const { isStrongPassword, isEmail} = validator;

const strongPasswordOptions = {
    minLength: 8,
    minLowerCase: 1,
    minUpperCase: 1,
    minNumebers: 1,
    minSymbols: 1,
};

const {Schema, SchemaTypes, model} = mongoose;

const schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: Number,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    subscription_date: {
        type: Date,
        default: () => Date.now() 
    },
    is_admin: {
        type: Boolean,
        default: false
    }
});

schema.statics.signUp = async function (email, password){

    if(!isEmail(email)){
        throw StatusError(400, 'You should send a real email.')
    }

    if(!isStrongPassword(password, strongPasswordOptions)){
        throw StatusError(400, 'Password not strong enough.')
    }
    
    const emailExists = await this.exists({ email });
    if(emailExists) {
        const error = new Error(`${email} is already in use`)
        error.statusCode = 401;
        throw error;
    }

    const hashedPassword = await hashPassword(password);
    
    const user = await this.create({ email, password: hashedPassword})
    return user;

}

schema.statics.logIn = async function (email, password){

    const user = await this.findOne({ email });
    const passwordMatch = await comparePassword(password, user.password);
    if(!user || !passwordMatch) {
        const error = new Error('Incorrect email or password')
        error.statusCode = 401;
        throw error;
    }
    
    return user;
}

schema.methods.clean = function(){
    const user = this.toObject();
    delete user.password;
    delete user.__v;
    delete user._id;
    return user;
}

const User = model('User', schema);

export default User;