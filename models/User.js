import mongoose from "mongoose";
import validator from "validator";
import { StatusError } from "../lib/errorHelper.js";
import { comparePassword, hashPassword } from "../lib/authorizationHelper.js";
const { isStrongPassword, isEmail} = validator;

const strongPasswordOptions = { //Validatore per la password con i criteri minimi per avere una psw sicura
    minLength: 8,
    minLowerCase: 1,
    minUpperCase: 1,
    minNumebers: 1,
    minSymbols: 1,
};

const {Schema, SchemaTypes, model} = mongoose;

const schema = new Schema({
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    subscription_date: {
        type: Date,
        default: () => Date.now(),
        immutable: true
    },
    team: [{
        type: SchemaTypes.ObjectId,
        ref: 'CustomPokemon'
    }]
});

//Static find by Email - Mi serve per trovare l'utente attraverso la sua email
schema.static.findByEmail = function({ email }){
    return this.findOne(email)
}

//Static for SIGNUP - Controllo che l'utente inserica i dati neccessari per lo SignUp
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

//Static for LOGIN - Controllo per il login, come per lo signup
schema.statics.logIn = async function (email, password){

    const user = await this.findOne({email}).populate('team', 'name nickname level attacks type id image staticPokemonId description'); //Populate che serve affinché l'utente abbia sempre al suo interno il suo team, quando effettua il login
    const passwordMatch = await comparePassword(password, user.password);
    if(!user || !passwordMatch) {
        const error = new Error('Incorrect email or password')
        error.statusCode = 401;
        throw error;
    }  
    return user;
}

const User = model('User', schema);

export default User;