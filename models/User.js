import dayjs from "dayjs";
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

schema.statics.findByUsername = function(username){
    return this.findOne({username});
}

schema.statics.signUp = async function (email, password){

    if(!isEmail(email)){
        throw StatusError(400, 'You should send a real email.')
    }

    if(!isStrongPassword(password, strongPasswordOptions)){
        throw StatusError(400, 'Password not strong enough.')
    }
    
    const hashedPassword = await hashedPassword(password);

    const user = await this.create({email, password: hashPassword});

    return user;

}

schema.statics.logIn = async function (email, password){

    const user = await this.findByUsername(username);

    const fail = () => {
        throw StatusError(401, 'Incorrect Email or Password');
    }

    if(!user){
        fail();
    }

    const passwordMatch = await comparePassword(password, user.password);
    if(!passwordMatch){
        fail();
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