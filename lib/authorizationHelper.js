import bcrypt from "bcrypt";
import dotenv from "dotenv"; dotenv.config();
import jwt from "jsonwebtoken";
const { PEPPER_KEY, SECRET_KEY } = process.env;


export const hashPassword = async (password) => {  //Funzione che mi permette di hashare la password, aggiungendo sale e pepe

    const salt = await bcrypt.genSalt(10);

    const pepperedPsw = password + PEPPER_KEY;

    const hashedPassword = await bcrypt.hash(pepperedPsw, salt);
    
    return hashedPassword;  
   
};

export const comparePassword = async (password, hashedPassword) => { //Funzione per comparare la password che inserisce l'utente con quella hashata

    const pepperedPsw = password + PEPPER_KEY;

    const match = await bcrypt.compare(pepperedPsw, hashedPassword);

    return match;
}

export const generateToken = (_id) => { //Generazione del token, che serve per l'autorizzazione 
    console.log("Generazione del token in corso...")
    const token = jwt.sign( //Nella signature metto id Utente, la secret Key
        { _id },
        SECRET_KEY,
        { expiresIn: '3d' } //Do una scadenza di 3 giorni
    );
    console.log("Token generate:", token);
    return token;
    
}

export const requireAuth = () => { //Middleware che mi serve per decidere le rotte a cui serve autenticazione
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
