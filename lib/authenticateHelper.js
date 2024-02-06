import bcrypt from "bcrypt";
import dotenv from "dotenv"; dotenv.config();
const { PEPPER_KEY, SECRET_KEY } = process.env;
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const hashPassword = async (password) => {

    const salt = await bcrypt.genSalt(10);

    const combined = password + PEPPER_KEY;

    const hashedPassword = bcrypt.hash(combined, salt);
    
    return hashedPassword;  
   
};



export const comparePassword = async (password, hashPassword) => {

    const combined = password + PEPPER_KEY;

    const match = await bcrypt.compare(combined, hashPassword);

    return match;
}

export const generateToken = (_id) => {
    const token = jwt.sign(
        { _id },
        SECRET_KEY,
        { expiresIn: '3d' }
    );
    return token;
}

export const verifyToken = (token) => {
    const { _id } = jwt.verify(token, SECRET_KEY);
    return _id;
};

export const requireAuth = () => {
    return async (req, res, next) => {

        try{

            const token = req.cookies?.token;

            if(!token){
                throw new Error('Token required!');
            }

            const _id = verifyToken(token);

            const user = await User.findById(_id);
            if(!user){
                throw new Error('User not found!');
            }

            req.user = user;

        }catch(error){
            console.error(error);
            return res.status(401).send(`Request is not authorized: ${error.message}`);
        }

        next();
    }
}

export const requireAdmin = () => {
    return async (req, res, next) => {

        try{

            const {user} = req;

            if(!user.is_admin){
                throw new Error('Role unauthorized');
            }
        }catch(error){
            console.error(error.message);
            return res.status(401).send(`Request is not authorized: ${error.message}`);
        }

        next();
    }
}

export const requireOwner = () => {
    return async (req, res, next) => {
        req.dbQuery = req.user.is_admin ? {} : {
            user: req.user.id
        }
        next();
    }
};