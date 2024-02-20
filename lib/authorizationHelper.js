import bcrypt from "bcrypt";
import dotenv from "dotenv"; dotenv.config();
import jwt from "jsonwebtoken";
const { PEPPER_KEY, SECRET_KEY } = process.env;


export const hashPassword = async (password) => {

    const salt = await bcrypt.genSalt(10);

    const pepperedPsw = password + PEPPER_KEY;

    const hashedPassword = await bcrypt.hash(pepperedPsw, salt);
    
    return hashedPassword;  
   
};

export const comparePassword = async (password, hashedPassword) => {

    const pepperedPsw = password + PEPPER_KEY;

    const match = await bcrypt.compare(pepperedPsw, hashedPassword);

    return match;
}

export const generateToken = (_id) => {
    console.log("Generazione del token in corso...")
    const token = jwt.sign(
        { _id },
        SECRET_KEY,
        { expiresIn: '3d' }
    );
    console.log("Token generate:", token);
    return token;
    
}

export const requireAuth = () => {
    return async (req, res, next) => {

        try{

            const { authorization } = req.headers;

            const token = authorization?.split(' ')[1];

            if(!token) {
                throw new Error('Token required!')
            }
            const decodedToken = jwt.verify(token, SECRET_KEY);
            req.user = decodedToken;

        }catch(error){
            console.error(error);
            return res.status(401).send(`Request is not authorized: ${error.message}`);
        }

        next();
    }
};
